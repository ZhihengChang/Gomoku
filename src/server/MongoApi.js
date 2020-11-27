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

    connect(callback) {
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

    /**
     * Insert one or multiple data record(s) to the specified collection 
     * in the current database.
     * @param {string} collection 
     * @param  {...object} data 
     */
    async insert(collection, ...data) {
        if (!data.length) return;
        let _result;
        try{
            let _collection = this.getDB().collection(collection);
            _result = await _collection.insertMany(data);
        }catch(err){
            console.log(err);
        }
        return _result;
    }

    /**
     * Select one or multiple data record under given criteria (query)
     * in the current database.  
     * If no query provided, selet all.
     * @param {string} collection 
     * @param {object} query 
     */
    async select(collection, query){
        let _result;
        let _query = query || {};
        try{
            let _collection = this.getDB().collection(collection);
            _result = await _collection.find(_query).toArray();
        }catch(err){
            console.log(err);
        }
        return _result;
    }

    /**
     * Delete one or more records from the specified collection
     * in the current database.
     * If no query provided, delete all.
     * @param {string} collection 
     * @param {object} query 
     */
    async delete(collection, query){
        let _result;
        let _query = query || {};
        try{
            let _collection = this.getDB().collection(collection);
            _result = await _collection.deleteMany(_query);
        }catch(err){
            console.log(err);
        }
        return _result;
    }

    /**
     * Update query selected record to new values
     * @param {string} collection 
     * @param {object} query 
     * @param {object} newValue 
     */
    async update(collection, query, newValue){
        if(this.isEmpty(query) || this.isEmpty(newValue)) return;

        let _result;
        try{
            let _collection = this.getDB().collection(collection);
            _result = await _collection.updateMany(query, newValue);
        }catch(err){
            console.log(err);
        }
        return _result;
    }

    /**
     * Count the total number of documents within collection
     * @param {string} collection 
     * @param {object} query 
     */
    async count(collection, query){
        let _result;
        let _query = query || {};
        try{
            let _collection = this.getDB().collection(collection);
            _result = await _collection.countDocuments(_query);
        }catch(err){
            console.log(err);
        }
        return _result;
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

