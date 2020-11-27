'use strict';


class User{
    constructor(data){
        this._username = data.username;
        this._email = data.email;
        this._birthday = data.birthday;
        this._password = data.password;
        this._level = data.level;
        this._totalWins = data.totalWin;
        this._totalMatches = data.totalMatchs;
        this._rankPoints = data.rankPoints;
        this._signature = data.signature;
    }

    createNew(data){
        return {
            username: this._username,
            email: this._email,
            birthday: this._birthday,
            password: this._password,
            level: 1,
            totalWins: 0,
            totalMatches: 0,
            rankPoints: 0,
            signature: '',
        }
    }
}

module.exports = User;