'use strict';
const config = require('../config/config.json');
const util = require('./server_utilities');
const GameController = require('./GameController');
// const JWT_HEADER = '{"alg":"HS256","typ":"JWT"}';

//game[] = [game1, game2, ...]

const PSF = {
    //http
    login:          login,
    signup:         signup,
    createGame:     createGame,
    loadGameTable:  loadGameTable,
    joinGame:       joinGame,
    deleteGame:     deleteGame,

    getUser:        getUser,
    getGameOptions: getGameOptions,
    
    //ws
    newRoom: newRoom,
    addPlayerToRoom: addPlayerToRoom,
}

class ProxyServer {

    constructor(dbApi) {
        this._dbApi = dbApi;
        this._gameController = new GameController(dbApi);
        console.log('ProxyServer Started');
    }

    takeAction(reqBody, response) {
        let func = PSF[reqBody.action];
        if (func) {
            func.call(this._gameController, reqBody, response);
        }
    }

    handle_http_requests(request, response) {

        console.log('> Handle HTTP Request:', request.url);
        util.loadPage(request, response);

        if (request.method === 'POST') {
            util.getRequestBody(request, reqBody => {
                this.takeAction(reqBody, response);
                console.log('> HTTP Request Body:', reqBody);
            })
        }
    }

    handle_wss_requests(wsServer, request, socket, head) {
        console.log("> Handle WS Request:", request.url)
        wsServer.handleUpgrade(request, socket, head, (ws) => {
            ws.on('message', (req) => {
                let wsRequest = JSON.parse(req);
                console.log('> WS Request:', wsRequest);
                this.takeAction(wsRequest, ws);
            });

            // ws.on('close', function () {
            //     this._clients.delete(ws);
            // });
        });
    }
}

//#### http functions #########################################################################

/**
 * Handle sign up action
 * Create and insert new user based on reqBody data
 * @param {object} reqBody 
 * @param {object} response 
 */
async function signup(reqBody, response) {
    let _gameController = this;
    let _data = reqBody.data;
    let _action = reqBody.action;

    let _user = await _gameController.getUserByUsername(_data.username);
    if (_user) {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Username entered already exists.'
        });
        return;
    }

    await _gameController.createUser(_data);

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
    let _gameController = this;
    let _data = reqBody.data;
    let _action = reqBody.action;

    let _username = _data.username;
    let _password = _data.password;

    let _user = await _gameController.getUserByUsername(_username);
    if (!_user || _password != _user.password) {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Username or password is incorrect.'
        });
        return;
    }

    // _user.status = 'online';
    let _loginTime = new Date();
    let _authToken = util.createBase64JWT(config.service.JWT_HEADER, JSON.stringify({
        id:         _user.userId,
        username:   _username,
        ts:         _loginTime.getTime(),
    }), _user.password);

    _user.authToken = _authToken;
    _user.lastLogin = _loginTime;

    await _gameController.updateUser(_user.userId, _user);

    util.sendJsonResponse(response, _action, 200, 'SUCCESS', {
        userId:     _user.userId,
        username:   _user.username,
        authToken:  _authToken,
    });
}

/**
 * Handle create game action
 * Create and insert new match based on game options (reqBody data)
 * if there is no duplicate match return match otherwise return error message
 * @param {object} reqBody 
 * @param {object} response 
 */
async function createGame(reqBody, response){

    let _gameController = this;
    let _username = reqBody.user.username;
    let _data = reqBody.data;
    let _action = reqBody.action;
    
    //check duplicate
    let _duplicateMatch = await _gameController.getMatchByPlayer(_username);
    if (_duplicateMatch) {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Create Game: error: player already in game.',
        });
        return;
    }

    let _user = await _gameController.getUserByUsername(_username);
    let _match = await _gameController.createMatch(_user, _data);

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
    let _gameController = this;
    let _data = reqBody.data; //{}, should be criteria
    let _action = reqBody.action;
    
    let _matches = await _gameController.getMatch();
    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _matches);
}

/**
 * Handle join game action
 * update the match object
 * @param {object} reqBody 
 * @param {object} response 
 */
async function joinGame(reqBody, response){
    let _gameController = this;
    let _user = reqBody.user;
    let _matchId = reqBody.data.id;
    let _action = reqBody.action;

    let _match = await _gameController.getMatchById(+_matchId);
    
    //check match existence 
    if(!_match){
        util.sendJsonResponse(response, _action, 404, 'ERROR', {
            message: 'Unable to Join the Game: error: Game Not Found.',
        });
        return;
    }

    //check join own game
    if(_match.playerName == _user.username){
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Join the Game: error: Join the Game You Created.',
        });
        return;
    }
    
    //update match
    _match.status = 'In Game';
    _match.opponent = _user.username;
    _match.timestamp = new Date();
    let _result = await _gameController.updateMatch(+_matchId, _match);

    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _match);
    // await _gameController.deleteMatch(+_matchId);

}

/**
 * Delete specific match from match collection
 * @param {object} reqBody 
 * @param {object} response 
 */
async function deleteGame(reqBody, response){
    let _gameController = this;
    let _match = reqBody.data;
    let _user = reqBody.user;
    let _action = reqBody.action;

    await _gameController.deleteMatch(_match.matchId)
    util.sendJsonResponse(response, _action, 200, 'SUCCESS');
}

/**
 * Return relative user information
 * if there is no data in reqBody, return current user data
 * @param {object} reqBody 
 * @param {object} response 
 */
async function getUser(reqBody, response){
    let _gameController = this;
    let _data = reqBody.data;
    let _action = reqBody.action;
    let _userId = (!util.isEmpty(_data))? _data.userId: reqBody.user.userId;
    

    let _user = await _gameController.getUserById(_userId);

    if (!_user) {
        util.sendJsonResponse(response, _action, 404, 'ERROR', {
            message: 'Error: User Not Found.'
        });
        return;
    }

    //security operations
    delete _user.password;
    delete _user.email;

    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _user);
}

/**
 * Get user game options
 * if none return default game options
 * @param {object} reqBody 
 * @param {object} response 
 */
async function getGameOptions(reqBody, response){
    let _gameController = this;
    let _user = reqBody.user;
    let _action = reqBody.action;

    let _userOptions = await _gameController.getOptionsByUserId(_user.userId);
    if(!_userOptions){
        //use default options
        let _defaultGameOptions = config.options.game;
        util.sendJsonResponse(response, _action, 200, 'SUCCESS', _defaultGameOptions);
        return;
    }

    //return user game options
}

//#### websocket functions ######################################################################

async function newRoom(wsRequest, socket){
    let _gameController = this;
    let _user = wsRequest.user;
    let _data = wsRequest.data;

    //get match
    let _match = await _gameController.getMatchById(_data.matchId);
    _gameController.newRoom(_match, socket);
    // let _room = _gameController.getRoom(_data.matchId);

    util.sendWSResponse(socket, 'Room Created');

}

async function addPlayerToRoom(wsRequest, socket){
    let _gameController = this;
    let _user = wsRequest.user;
    let _matchId = wsRequest.data.matchId;

    //add to room
    let _match = await _gameController.getMatchById(_matchId);
    let _isOpponent = (_match.opponent == _user.username)? true: false;
    _gameController.addPlayerToRoom(_matchId, _user.username, socket, _isOpponent);
    
    //notify owner
    let _room = _gameController.getRoom(_matchId);
    if(_isOpponent){
        util.sendWSResponse(_room.owner.socket, 'Opponent Joined');
    }
    util.sendWSResponse(socket, 'Room Joined');
    
    //handle send to spec
}


module.exports = ProxyServer;