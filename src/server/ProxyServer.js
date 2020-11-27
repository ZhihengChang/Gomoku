'use strict';
const config = require('../config/config.json');
const util = require('./server_utilities');
const User = require('./User');
// const server_config = config.service;
// const db_config = config[server_config.dbType];
// const dbApi = require(`./${db_config.api}`).dbApi;

const PSF = {
    login: login,
    signup: signup,
}

class ProxyServer{

    constructor(dbApi){
        this._dbApi = dbApi;
    }

    takeAction(action, data, response){
        let func = PSF[action];
        if(func){
            func.call(this._dbApi, data, response);
        }
    }

    handle_client_requests(request, response){

        console.log(request.url);
        util.loadPage(request, response);
        if(request.method === 'POST'){
            util.getRequestBody(request, reqBody => {
                this.takeAction(reqBody.action, reqBody.data, response);
                console.log(reqBody);
            })
        }
    }
}

async function signup(data, response){
    let _db = this;
    let _collection = 'users'

    let _result = await _db.select(_collection, {username: data.username});
    if(!util.isEmpty(_result)){
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
        signupDate: new Date(),

    });

    console.log(_result);
    await _db.delete(_collection, {username: data.username});
    util.sendJsonResponse(response, 'signup', 200, 'SUCCESS', {
        message: 'Sign up successful! Back to login.'
    });
}

async function login(data, response){
    let _db = this;
    let _collection = 'users';

    let _username = data.username;
    let _password = data.password;
    let _result = await _db.select(_collection, {username: _username});
    let _user = _result[0];
    console.log(_user);
    if(util.isEmpty(_user) || _password != _user.password){
        util.sendJsonResponse(response, 'login', 400, 'ERROR', {
            message: 'Username or password is incorrect.'
        });
        return;
    }
    _db.update(_collection, {username: _username}, {$set: {lastLogin: new Date()}});
    util.sendJsonResponse(response, 'login', 200, 'SUCCESS', _user);
    

}

module.exports = {ProxyServer};