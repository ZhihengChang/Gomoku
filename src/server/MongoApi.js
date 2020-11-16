'use strict';
let DBInterface = require('./DBInterface');
const MongoClient = require("mongodb").MongoClient;

class DBConn {
    connection = null;

    constructor(url, option) {
        this._url = url;
        this._option = option;
    }
    connect = () => new Promise((resolve, reject) => {
            MongoClient.connect(url, option, function(err, db) {
            if (err) { reject(err); return; };
            resolve(db);
            this.connection = db;
        });
    });

    get = () => {
        if(!this.connection) {
            throw new Error('Call connect first!');
        }

        return this.connection;
    }
}


class DBApi extends DBInterface{
    _conn;
    constructor(host, port, db, option) {
        super();
        this._url = `mongodb://${host}:${port}/`;
        this._db = db;
        this._option = option;
        this._conn = null;
        // this._conn = this.connect();
    }

    getConn() {
        this._conn = new DBConn(this._url, this._option);
        this._conn.connect().catch(err => console.log(err));
        console.log(this._conn.get());
    }
    getDB() {
        // if(!this._conn){
            this.getConn();
        // }
        console.log(this._conn);
        return this._conn.get().db(this._db);
    }

    async insert1(client, collection, ...data) {
        let result;
        try{
            let _collection = this.getDB().collection(collection);
            result = await _collection.insertMany(data);
            console.log(result);
        }catch(err){
            console.log(err);
        }
        return result;
    }


    /**
     * If db (database name) is provided, switch to that db 
     * otherwise just return current db name
     * @param {string} db 
     * @returns current db name
     */
    currentDB(db){
        if(db) this._db = db;
        return this._db;
    }

    /**
     * Connect to the database through the database url and option
     * @returns {promise} client
     */
    async connect(){
        let client = await MongoClient.connect(this._url, this._option)
        .catch(err => {throw(err)});
        return client;
    }

    /**
     * Insert one or multiple data record(s) to the specified collection 
     * in the current database.
     * @param {promise result} client 
     * @param {string} collection 
     * @param  {...object} data 
     */
    async insert(client, collection, ...data) {

        if (!client) return;

        if (!data.length) return;

        let result;
        try{
            let dbo = client.db(this._db);
            let _collection = dbo.collection(collection);
            result = await _collection.insertMany(data);
            console.log(result);
        }catch(err){
            console.log(err);
        }

        return result;
    }

    /**
     * Select one or multiple data record under given criteria (query)
     * in the current database.  
     * If no query provided, selet all.
     * @param {promise result} client 
     * @param {string} collection 
     * @param {object} query 
     */
    async select(client, collection, query){
        if (!client) return;

        let result;
        let _query = query || {};
        try{
            let dbo = client.db(this._db);
            let _collection = dbo.collection(collection);
            result = await _collection.find(_query).toArray();
            console.log(result);
        }catch(err){
            console.log(err);
        }

        return result;
    }

    /**
     * Delete one or more records from the specified collection
     * in the current database.
     * If no query provided, delete all.
     * @param {promise result} client 
     * @param {string} collection 
     * @param {object} query 
     */
    async delete(client, collection, query){
        if (!client) return;

        let result;
        let _query = query || {};
        try{
            let dbo = client.db(this._db);
            let _collection = dbo.collection(collection);
            result = await _collection.deleteMany(_query);
            console.log("deletedCount:", result.result.n);
        }catch(err){
            console.log(err);
        }

        return result;
    }

    /**
     * Update query selected record to new values
     * @param {promise result} client 
     * @param {string} collection 
     * @param {object} query 
     * @param {object} newValue 
     */
    async update(client, collection, query, newValue){
        if(!client) return;
        if(this.isEmpty(query) || this.isEmpty(newValue)) return;

        let result;
        try{
            let dbo = client.db(this._db);
            let _collection = dbo.collection(collection);
            result = await _collection.updateMany(query, newValue);
            console.log("updateCount:", result.result.n);
        }catch(err){
            console.log(err);
        }

        return result;
    }

    isEmpty(_obj){
        if (Array.isArray(_obj) && _obj.length == 0) return true;
        if (_obj instanceof Set && _obj.size == 0) return true;
        if (_obj instanceof Map && _obj.size == 0) return true;
        return (!_obj || Object.keys(_obj).length == 0);
    }

}

module.exports = { DBApi };