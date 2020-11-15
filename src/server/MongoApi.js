'use strict';
let DBInterface = require('./DBInterface');
const MongoClient = require("mongodb").MongoClient;

class DBApi extends DBInterface{

    constructor(host, port, db, option) {
        super();
        this._url = `mongodb://${host}:${port}/`;
        this._db = db;
        this._option = option;
        this._conn = null;
        // this._conn = this.connect();
    }

    currentDB(){
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


}

module.exports = { DBApi };