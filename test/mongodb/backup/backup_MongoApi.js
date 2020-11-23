'use strict';
const DBInterface = require('./DBInterface');
const MongoClient = require("mongodb").MongoClient;
const db_cfg = require('../config/config.json').Mongodb;

class DBApi extends DBInterface{
    _conn; 
    _db_name;
    constructor(host, port, db, option) {
        super();
        this._url = `mongodb://${host}:${port}/`;
        this._db_name = db;
        this._option = option;
        //console.log(host, port, db, option);
    }

    dbConnect(callback) {
        MongoClient.connect(this._url, this._option, (err, client) => {
            if(err){
                MongoClient.close();
                callback(err);
            }
            this._conn = client;
            console.log("Database Connected");
            callback(null);
        })
    }
    getDB(dbName) {
        if(this._conn){
            return (dbName)? this._conn.db(dbName): this._conn.db(this._db_name);
        }
        return null;
    }

    async insert1(collection, ...data) {
        console.log("inserting...");
        let _collection = this.getDB().collection(collection);
        let _result = await _collection.insertMany(data);
        console.log(_result);
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

const dbApi = new DBApi(db_cfg.host, db_cfg.port, db_cfg.database, db_cfg.option);
module.exports = { dbApi };

