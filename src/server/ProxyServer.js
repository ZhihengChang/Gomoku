'use strict';
const fs = require('fs');
const User = require('./User');
const config = require('../config/config.json');
const util = require('./server_utilities');
const { ClientRequest } = require('http');
const JWT_HEADER = '{"alg":"HS256","typ":"JWT"}';

const PSF = {
    login: login,
    signup: signup,
}

class ProxyServer {

    constructor(dbApi) {
        this._dbApi = dbApi;
        // this._wss = new Map();
        this._clients = new Set();
    }

    takeAction(action, data, response) {
        let func = PSF[action];
        if (func) {
            func.call(this._dbApi, data, response);
        }
    }

    handle_http_requests(request, response) {

        console.log(request.url);
        util.loadPage(request, response);

        if (request.method === 'POST') {
            util.getRequestBody(request, reqBody => {
                this.takeAction(reqBody.action, reqBody.data, response);
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

async function signup(data, response) {
    let _db = this;
    let _collection = 'users'

    let _result = await _db.select(_collection, { username: data.username });
    if (!util.isEmpty(_result)) {
        util.sendJsonResponse(response, 'signup', 400, 'ERROR', {
            message: 'Username entered already exists.'
        });
        return;
    }

    let id = 1000 + await _db.count(_collection);
    _result = await _db.insert(_collection, {
        userId: id,
        username: data.username,
        email: data.email,
        birthday: data.birthday,
        password: data.password,
        exp: 0,
        totalWins: 0,
        totalMatches: 0,
        rankPoints: 0,
        signature: '',
        lastLogin: new Date(0),
        logOffTime: new Date(0),
        signupDate: new Date(),
        authToken: ''
    });

    console.log(_result);
    //await _db.delete(_collection, {username: data.username});
    util.sendJsonResponse(response, 'signup', 200, 'SUCCESS', {
        message: 'Sign up successful! Back to login.'
    });
}

async function login(data, response) {
    let _db = this;
    let _collection = 'users';

    let _username = data.username;
    let _password = data.password;
    let _result = await _db.select(_collection, { username: _username });
    let _user = _result[0];
    console.log(_user);
    if (util.isEmpty(_user) || _password != _user.password) {
        util.sendJsonResponse(response, 'login', 400, 'ERROR', {
            message: 'Username or password is incorrect.'
        });
        return;
    }
    let _loginTime = new Date();
    _user.lastLogin = _loginTime;
    let _payload = JSON.stringify({
        id: _user.userId,
        username: _username,
        ts: _loginTime.getTime(),
    });
    let _authToken = util.createBase64JWT(JWT_HEADER, _payload, _user.password);
    _user.authToken = _authToken;

    // let _updateQuery = {$set: {lastLogin: _loginTime, authToken: _authToken}};
    let result = await _db.replace(_collection, { username: _username }, _user);
    util.sendJsonResponse(response, 'login', 200, 'SUCCESS', _user);
}

module.exports = { ProxyServer };