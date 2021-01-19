'use strict';
const config = require('../config/config.json');
const util = require('./server_utilities');
const GameController = require('./GameController');
// const JWT_HEADER = '{"alg":"HS256","typ":"JWT"}';

//game[] = [game1, game2, ...]

const PSF = {
    //http
    login: login,
    logout: logout,
    signup: signup,
    createGame: createGame,
    loadGameTable: loadGameTable,
    joinGame: joinGame,
    deleteGame: deleteGame,

    getUser: getUser,
    getGameOptions: getGameOptions,

    //ws
    newRoom: newRoom,
    addPlayerToRoom: addPlayerToRoom,
    chooseColor: chooseColor,
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

    // if(_user.status != 'ingame'){
    _user.status = 'online';
    // }

    let _loginTime = new Date();
    let _authToken = util.createBase64JWT(config.service.JWT_HEADER, JSON.stringify({
        id: _user.userId,
        username: _username,
        ts: _loginTime.getTime(),
    }), _user.password);

    _user.authToken = _authToken;
    _user.loginTime = _loginTime;
    _user.logoutTime = null;

    await _gameController.updateUser(_user.userId, _user);

    util.sendJsonResponse(response, _action, 200, 'SUCCESS', {
        userId: _user.userId,
        username: _user.username,
        authToken: _authToken,
    });
}

/**
 * Handle logout action
 * update user status to offline when user is not ingame
 * when user is ingame close game page to log user out
 * @param {object} reqBody 
 * @param {object} response 
 */
async function logout(reqBody, response) {
    let _gameController = this;
    let _userId = reqBody.user.userId;
    // let _action = reqBody.action;

    let _user = await _gameController.getUserById(_userId);

    _user.logoutTime = new Date();
    // if(_user.status != 'ingame'){
    _user.status = 'offline';
    _user.authToken = null;
    // }

    _gameController.updateUser(_userId, _user);
}

/**
 * Handle create game action
 * Create and insert new match based on game options (reqBody data)
 * if there is no duplicate match return match otherwise return error message
 * @param {object} reqBody 
 * @param {object} response 
 */
async function createGame(reqBody, response) {

    let _gameController = this;
    let _username = reqBody.user.username;
    let _data = reqBody.data;
    let _action = reqBody.action;

    //check duplicate
    let _duplicateMatch = await _gameController.getMatchByOwnerName(_username);
    if (_duplicateMatch) {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Create Game: error: You Have Already created the Game.',
        });
        return;
    }

    let _user = await _gameController.getUserByUsername(_username);
    let _match = await _gameController.createMatch(_user, _data);

    _user.status = 'ingame';
    await _gameController.updateUser(_user.userId, _user);

    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _match);
}

/**
 * Handle load game table action
 * select matches from 'matches' collection based on the criteria
 * return match array (empty array [] is returned when no match in the collection)
 * @param {object} reqBody 
 * @param {object} response 
 */
async function loadGameTable(reqBody, response) {
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
async function joinGame(reqBody, response) {
    let _gameController = this;
    let _userId = reqBody.user.userId;
    let _matchId = reqBody.data.id;
    let _action = reqBody.action;

    let _user = await _gameController.getUserById(_userId);
    let _match = await _gameController.getMatchById(+_matchId);

    //check match existence 
    if (!_match) {
        util.sendJsonResponse(response, _action, 404, 'ERROR', {
            message: 'Unable to Join the Game: error: Game Not Found.',
        });
        return;
    }
    //check match already start
    if (_match.status == 'In Game') {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Join the Game: error: Game has Already Started',
        });
        return;
    }
    //check join own game
    if (_match.owner.username == _user.username) {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Join the Game: error: Join the Game You Created.',
        });
        return;
    }
    //check ingame status
    if (_user.status == 'ingame') {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Join the Game: error: You are Already In Game.',
        });
        return;
    }
    //check offline status
    if (_user.status == 'offline') {
        util.sendJsonResponse(response, _action, 400, 'ERROR', {
            message: 'Unable to Join the Game: error: You are Currently Offline. Please Login.',
        });
        return;
    }

    //update match
    _match.status = 'In Game';
    _match.timestamp = new Date();
    _match.opponent = {
        userId: _user.userId,
        username: _user.username,
        matchTime: _match.matchTime,
    }
    if (_match.owner.color) {
        _match.opponent.color = (_match.owner.color == 'black') ? 'white' : 'black';
        _match.colorLock = true;
    }

    await _gameController.updateMatch(+_matchId, _match);

    //update user
    _user.status = 'ingame';
    await _gameController.updateUser(_userId, _user);

    util.sendJsonResponse(response, _action, 200, 'SUCCESS', _match);
}

/**
 * Delete specific match from match collection
 * @param {object} reqBody 
 * @param {object} response 
 */
async function deleteGame(reqBody, response) {
    let _gameController = this;
    let _matchId = reqBody.data.matchId;
    let _userId = reqBody.user.userId;
    let _action = reqBody.action;

    let _user = await _gameController.getUserById(_userId);
    _user.status = 'online';
    await _gameController.updateUser(_userId, _user);
    await _gameController.deleteMatch(_matchId);
    util.sendJsonResponse(response, _action, 200, 'SUCCESS');
}

/**
 * Return relative user information
 * if there is no data in reqBody, return current user data
 * @param {object} reqBody 
 * @param {object} response 
 */
async function getUser(reqBody, response) {
    let _gameController = this;
    let _data = reqBody.data;
    let _action = reqBody.action;
    let _userId = (!util.isEmpty(_data)) ? _data.userId : reqBody.user.userId;


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
async function getGameOptions(reqBody, response) {
    let _gameController = this;
    let _user = reqBody.user;
    let _action = reqBody.action;

    let _userOptions = await _gameController.getOptionsByUserId(_user.userId);
    if (!_userOptions) {
        //use default options
        let _defaultGameOptions = config.options.game;
        util.sendJsonResponse(response, _action, 200, 'SUCCESS', _defaultGameOptions);
        return;
    }

    //return user game options
}

//#### websocket functions ######################################################################

async function newRoom(wsRequest, socket) {
    let _gameController = this;
    let _user = wsRequest.user;
    let _data = wsRequest.data;

    //get match
    let _match = await _gameController.getMatchById(_data.matchId);
    _gameController.newRoom(_match, socket);
    // let _room = _gameController.getRoom(_data.matchId);

    util.sendWSResponse(socket, 'Room Created');

}

async function addPlayerToRoom(wsRequest, socket) {
    let _gameController = this;
    let _user = wsRequest.user;
    let _matchId = wsRequest.data.matchId;

    //add to room
    let _match = await _gameController.getMatchById(_matchId);
    let _isOpponent = (_match.opponent.username == _user.username) ? true : false;
    _gameController.addPlayerToRoom(_matchId, _user.username, socket, _isOpponent);


    let countDownStartTime = new Date();
    let matchStartCountdown = config.options.game.matchStartCountdown;

    //send response
    let _message = 'Initiate Match Start Countdown';
    let _room = _gameController.getRoom(_matchId);
    util.groupSendWSResponse([_room.owner.socket, socket], _message, { 
        countDownStartTime, matchStartCountdown, match: _match,
    });

    _message = 'Match Start';
    setTimeout(async () => {
        if (!_match.colorLock) {
            _match.countDownStartTime = countDownStartTime;
            if (!_room.owner.color) {
                _match.owner.color = 'black';
                _match.opponent.color = 'white';
            } else {
                let previousColor = _room.owner.color;
                _room.owner.color = (previousColor == 'black') ? 'white' : 'black';
                _match.opponent.color = previousColor;
            }
            _match.colorLock = true;
            await _gameController.updateMatch(_matchId, _match);
        }
        util.groupSendWSResponse([_room.owner.socket, socket], _message, _match);
    }, matchStartCountdown * 1000);

    //handle send to spec
}

async function chooseColor(wsRequest, socket) {
    let _gameController = this;
    // let _userId = wsRequest.user.userId;
    let _user = wsRequest.user;
    let _data = wsRequest.data;
    let _color = _data.color;

    let _match = await _gameController.getMatchById(_data.matchId);

    //set color
    if (_match.colorLock) return;
    
    if(_user.username == _match.owner.username){
        _match.owner.color = (_color)? _color: null;
        if(_match.opponent){
            _match.opponent.color = (_color == 'black')? 'white': 'black';
            _match.colorLock = true;
        }
    }else{
        _match.opponent.color = _color;
        _match.owner.color = (_color == 'black')? 'white': 'black';
        _match.colorLock = true;
    }

    await _gameController.updateMatch(_match.matchId, _match);
    
    //send color
    let _message = 'Set Piece Color';
    let _room = _gameController.getRoom(_match.matchId);
    if(_match.opponent){
        let group = [_room.owner.socket, _room.opponent.socket];
        util.groupSendWSResponse(group, _message, _match);
    }else{
        util.sendWSResponse(socket, _message, _match);
    }
    

}


module.exports = ProxyServer;