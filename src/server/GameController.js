'use strict';
const config = require('../config/config.json');

class GameController {

    constructor(dbApi) {
        console.log('Init Game Controller ...');
        this._dbApi = dbApi;
        this._rooms = {};
        this._collections = config.service.dbCollections;
        console.log('Game Controller started');
    }

    //#### user functions #########################################################################

    /**
     * Create a user based on the given data
     * @param {object} data 
     */
    async createUser(data) {
        console.log(`* Creating user: ${JSON.stringify(data)}`);
        let _collection = this._collections.user;

        let _id = await this.generateId(_collection);
        let _result = await this._dbApi.insert(_collection.name, {
            userId: _id,
            username: data.username,
            email: data.email,
            birthday: data.birthday,
            password: data.password,
            exp: 0,
            totalWins: 0,
            totalMatches: 0,
            rankPoints: 0,
            signature: null,
            // status:         'offline',
            lastLogin: new Date(0),
            logOffTime: new Date(0),
            signupDate: new Date(),
            authToken: null,
        });
        console.log(`* User Created: ${_result.result.ok}`);
    }

    /**
     * return a user array that contains users fall in the given critera (query)
     * @param {object} query 
     */
    async getUser(query) {
        console.log(`* Getting User by Criteria: ${JSON.stringify(query)}`);
        let _collection = this._collections.user;
        let _result = await this._dbApi.select(_collection.name, query);
        console.log(`* Total User get: ${_result.length}`);
        return _result;
    }

    /**
     * return user corresponding to the given username
     * return type: object
     * @param {string} username 
     */
    async getUserByUsername(username) {
        console.log(`* Getting User by Username: ${username}`);
        let _result = await this.getUser({ username });
        console.log('* User Get:', _result[0]);
        return (_result.length != 0) ? _result[0] : null;
    }

    /**
     * return user corresponding to the given userId
     * return type: object
     * @param {number} userId 
     */
    async getUserById(userId) {
        console.log(`* Getting User by ID: ${userId}`);
        let _result = await this.getUser({ userId });
        console.log('* User Get:', _result[0]);
        return (_result.length != 0) ? _result[0] : null;
    }

    /**
     * Update user object corresponding to the given userId
     * @param {number} userId 
     * @param {object} newUser 
     */
    async updateUser(userId, newUser) {
        console.log(`* Updating User: ${userId}`);
        let _collection = this._collections.user;

        let _result = await this._dbApi.replace(_collection.name,
            { userId }, newUser
        );
        console.log(`* User Updated: ${_result.result.ok}`);
        // return _result;
    }

    //#### game functions #########################################################################

    /**
     * Create a match object based on the given data
     * @param {object} data 
     */
    async createMatch(user, data) {
        console.log(`* Creating Match: ${JSON.stringify(data)}`);
        let _collection = this._collections.game;

        let _id = await this.generateId(_collection);
        let _match = {
            matchId: _id,
            playerId: user.userId,
            playerName: user.username,
            playerExp: user.exp,
            status: 'Waiting',
            opponent: null,
            first: null,
            boardSize: data.boardSize,
            undo: data.undo,
            chat: data.chat,
            spectate: data.spectate,
            spectating: 0,
            stepsQueue: [],
            matchWinner: null,
            matchTime: null,
            timestamp: new Date(),
        };
        let _result = await this._dbApi.insert(_collection.name, _match);
        console.log(`Match Created: ${_result.result.ok}`);
        return _match;
    }

    async setFirst(match, username){
        console.log(`* Setting ${username} to be First...`);
        match.first = username;
        await this.updateMatch(match.matchId, match);
        console.log(`* First Set to ${username}`);
    }

    /**
     * return a match array that contains matches fall in the given critera (query)
     * @param {object} query 
     */
    async getMatch(query) {
        console.log(`* Getting Match by Criteria: ${JSON.stringify(query)}`);
        let _collection = this._collections.game;
        let _result = await this._dbApi.select(_collection.name, query);
        console.log(`* Total Match Get: ${_result.length}`);
        return _result;
    }

    /**
     * return match object corresponding to the given match id
     * return type: object
     * @param {number} matchId 
     */
    async getMatchById(matchId) {
        console.log(`* Getting Match by matchId: ${matchId}`);
        let _result = await this.getMatch({ matchId });
        console.log('* Match Get:', _result[0]);
        return (_result.length != 0) ? _result[0] : null;
    }

    /**
     * return match object corresponding to the given player name
     * return type: object
     * @param {string} playerName 
     */
    async getMatchByPlayer(playerName) {
        console.log(`* Getting Match by player: ${playerName}`);
        let _result = await this.getMatch({ playerName });
        console.log('* Match Get:', _result[0]);
        return (_result.length != 0) ? _result[0] : null;
    }

    /**
     * Update match object corresponding to the given match id
     * @param {number} matchId 
     * @param {object} newMatch 
     */
    async updateMatch(matchId, newMatch) {
        console.log(`* Updating Match: ${matchId}`);
        let _collection = this._collections.game;

        let _result = await this._dbApi.replace(_collection.name,
            { matchId }, newMatch
        );
        console.log(`* Match Updated: ${_result.result.ok}`);
        // return _result;
    }

    /**
     * delete match object corresponding to the given match id
     * @param {number} matchId 
     */
    async deleteMatch(matchId) {
        console.log(`* Deleting Match: ${matchId}`);
        let _collection = this._collections.game;

        let _result = await this._dbApi.delete(_collection.name, { matchId });
        console.log(`* Match Removed: ${_result.result.ok}`);
        // return _result;
    }

    //#### room functions #########################################################################

    newRoom(match, userSocket) {
        console.log(`* Creating New Room for Match: ${match.matchId}`);
        this._rooms[match.matchId] = {
            owner: {
                username: match.playerName,
                socket: userSocket,
            },
            opponent: null,
            specList: [],
        }
    }

    getRoom(matchId){
        console.log(`* Getting Room by matchId: ${matchId}`);
        console.log('* Room Get:', this._rooms[matchId]);
        return this._rooms[matchId];
    }

    addPlayerToRoom(matchId, playerName, userSocket, isOpponent) {
        console.log(`* Adding Player: ${playerName} to Room: ${matchId}`);
        if (isOpponent) {
            this._rooms[matchId].opponent = {
                username: playerName,
                socket: userSocket,
            };
            return;
        }
        this._rooms[matchId].specList.push(userSocket);
    }

    //#### optn functions #########################################################################

    /**
     * return a option array that contains option sets fall in the given critera (query)
     * @param {object} query 
     */
    async getOptions(query) {
        console.log(`* Getting Options by Criteria: ${JSON.stringify(query)}`);
        let _collection = this._collections.setting;
        let _result = await this._dbApi.select(_collection.name, query);
        console.log(`* Total Options Get: ${_result.length}`);
        return _result;
    }

    /**
     * Get game settings corresponding to the given userId
     * @param {number} userId 
     */
    async getOptionsByUserId(userId) {
        console.log(`* Getting Options by userId: ${userId}`);
        let _result = await this.getOptions({ userId });
        console.log('* Options Get:', _result[0]);
        return (_result.length != 0) ? _result[0] : null;
    }

    //#### util functions #########################################################################

    /**
     * generate next id for incoming data record
     */
    async generateId(collection) {
        console.log(`* Generating ID for ${collection.name}`);
        let _id = collection.startId + await this._dbApi.count(collection.name);
        console.log(`* ID Generated: ${_id}`);
        return _id;
    }

}

module.exports = GameController;