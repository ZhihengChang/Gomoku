'use strict';
const fs = require('fs');
const config = require('../config/config.json');
const util = require('./server_utilities');
const { ClientRequest } = require('http');
const JWT_HEADER = '{"alg":"HS256","typ":"JWT"}';

const PSF = {
    login:          login,
    signup:         signup,
    createGame:     createGame,
    loadGameTable:  loadGameTable,
    joinGame:       joinGame,
    deleteGame:     deleteGame,
    getGameOptions: getGameOptions,
}

class ProxyServer {

    constructor(dbApi) {
        this._dbApi = dbApi;
        // this._wss = new Map();
        this._clients = new Set();
    }

    takeAction(reqBody, response) {
        let func = PSF[reqBody.action];
        if (func) {
            func.call(this._dbApi, reqBody, response);
        }
    }

    handle_http_requests(request, response) {

        console.log(request.url);
        util.loadPage(request, response);

        if (request.method === 'POST') {
            util.getRequestBody(request, reqBody => {
                this.takeAction(reqBody, response);
                console.log(reqBody);
            })
        }
    }

    handle_wss_requests(wsServer, request, socket, head) {
        console.log("wss:", request.url)
        wsServer.handleUpgrade(request, socket, head, (ws) => {
            this._clients.add(ws);
            ws.on('message', (message) => {
                for (let client of this._clients) {
                    client.send(message);
                }
            });

            // ws.on('close', function () {
            //     this._clients.delete(ws);
            // });
        });
    }
}

/**
 * Handle sign up action
 * Create and insert new user based on reqBody data
 * @param {object} reqBody 
 * @param {object} response 
 */
async function signup(reqBody, response) {
    let _db = this;
    let _collection = 'users'
    let _data = reqBody.data;
    let _action = reqBody.action;

    let _result = await _db.select(_collection, { username: _data.username });
    if (!util.isEmpty(_result)) {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Username entered already exists.'
        });
        return;
    }

    let id = 1000 + await _db.count(_collection);
    _result = await _db.insert(_collection, {
        userId: id,
        username:       _data.username,
        email:          _data.email,
        birthday:       _data.birthday,
        password:       _data.password,
        exp:            0,
        totalWins:      0,
        totalMatches:   0,
        rankPoints:     0,
        signature:      null,
        lastLogin:      new Date(0),
        logOffTime:     new Date(0),
        signupDate:     new Date(),
        authToken:      null,
    });

    console.log(_result);
    //await _db.delete(_collection, {username: _data.username});
    util.sendJsonResponse(response, _action, 200, 'SUCCESS', {
        message: 'Sign up successful! Back to login.'
    });
}

/**
 * Handle login action
 * Validate user input username and password
 * if match return user otherwise return error message
 * @param {object} reqBody 
 * @param {object} response 
 */
async function login(reqBody, response) {
    let _db = this;
    let _collection = 'users';
    let _data = reqBody.data;
    let _action = reqBody.action;

    let _username = _data.username;
    let _password = _data.password;
    let _selectQuery = { username: _username };
    let _result = await _db.select(_collection, _selectQuery);
    let _user = _result[0];
    console.log(_user);
    if (util.isEmpty(_user) || _password != _user.password) {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Username or password is incorrect.'
        });
        return;
    }

    let _loginTime = new Date();
    _user.lastLogin = _loginTime;
    let _payload = JSON.stringify({
        id:         _user.userId,
        username:   _username,
        ts:         _loginTime.getTime(),
    });
    let _authToken = util.createBase64JWT(JWT_HEADER, _payload, _user.password);
    _user.authToken = _authToken;

    let result = await _db.replace(_collection, _selectQuery, _user);
    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _user);
}

/**
 * Handle create game action
 * Create and insert new match based on game options (reqBody data)
 * if there is no duplicate match return match otherwise return error message
 * @param {object} reqBody 
 * @param {object} response 
 */
async function createGame(reqBody, response){
    let _db = this;
    let _collection = 'matches';
    let _data = reqBody.data;
    let _user = reqBody.user;
    let _action = reqBody.action;
    
    //check duplicate
    let _duplicates = await _db.select(_collection, { playerUsername: _user.username});
    if (!util.isEmpty(_duplicates)) {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Create Game: error: player already in game.',
        });
        return;
    }

    let _matchId = await _db.count(_collection); //starts from 0
    let _match = {
        matchId:            _matchId,
        playerId:           _user.userId,
        playerUsername:     _user.username,
        playerExp:          _user.exp,
        status:             'Waiting',
        opponent:           null,
        boardSize:          _data.boardSize,
        undo:               _data.undo,
        chat:               _data.chat,
        spectate:           _data.spectate,
        spectating:         0,
        stepsQueue:         [],
        matchWinner:        null,
        matchTime:          null,
        timestamp:          new Date(),
    };
    let _result = await _db.insert(_collection, _match);

    //insert game
    console.log(_result);
    // await _db.delete(_collection, {username: _data.username});
    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _match);
}

/**
 * Handle load game table action
 * select matches from 'matches' collection based on the criteria
 * return match array (empty array [] is returned when no match in the collection)
 * @param {object} reqBody 
 * @param {object} response 
 */
async function loadGameTable(reqBody, response){
    let _db = this;
    let _collection = 'matches';
    let _data = reqBody.data; //{}, should be criteria
    // let _user = reqBody.user;
    let _action = reqBody.action;
    
    let _matches = await _db.select(_collection); 
    console.log(typeof _matches);
    console.log(_matches);
    // await _db.delete(_collection);
    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _matches);
}

/**
 * Handle join game action
 * update the match object
 * @param {object} reqBody 
 * @param {object} response 
 */
async function joinGame(reqBody, response){
    let _db = this;
    let _collection = 'matches';
    let _user = reqBody.user;
    let _matchInfo = reqBody.data;
    let _action = reqBody.action;

    let _selectQuery = { playerUsername: _matchInfo.player };
    let _matchArray = await _db.select(_collection, _selectQuery); 
    let _match = _matchArray[0];
    
    //check match existence 
    if(util.isEmpty(_match)){
        util.sendJsonResponse(response, _action, 404, 'ERROR', {
            message: 'Unable to Join the Game: error: Game Not Found.',
        });
        return;
    }

    //check join own game
    if(_match.playerUsername == _user.username){
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Join the Game: error: Join the Game You Created.',
        });
        return;
    }
    
    //update match
    _match.status = 'In Game';
    _match.opponent = _user.username;
    _match.timestamp = new Date();
    let _result = await _db.replace(_collection, _selectQuery, _match);
    console.log(_result);

    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _match);
    await _db.delete(_collection);

}

/**
 * 
 * @param {object} reqBody 
 * @param {object} response 
 */
async function deleteGame(reqBody, response){
    let _db = this;
    let _collection = 'matches';
    let _match = reqBody.data;
    let _user = reqBody.user;
    let _action = reqBody.action;

    let _selectQuery = { matchId: _match.matchId };
    let _result = await _db.delete(_collection, _selectQuery);
    console.log(_result);

    util.sendJsonResponse(response, _action, 200, 'SUCCESS');
}

/**
 * 
 * @param {object} reqBody 
 * @param {object} response 
 */
async function getGameOptions(reqBody, response){
    let _db = this;
    let _collection = 'userOptions';
    let _user = reqBody.user;
    let _action = reqBody.action;

    let _selectQuery = { userId: _user.userId };
    let _result = await _db.select(_collection, _selectQuery);
    console.log(_result);
    if(util.isEmpty(_result)){
        //use default options
        let _defaultGameOptions = config.options.game;
        util.sendJsonResponse(response, _action, 200, 'SUCCESS', _defaultGameOptions);
        return;
    }

    //return user game options
}

module.exports = { ProxyServer };