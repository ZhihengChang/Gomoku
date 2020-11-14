'use strict';
let DBApi = require('./DBApi');
const MongoClient = require("mongodb").MongoClient;

class MongoApi extends DBApi {

    _url; _conn; _db; _collection; _mongoClient;

    constructor(host, port, option) {
        super();
        this._url = `mongodb://${host}:${port}/`;
        this._option = option;
        //this._mongoClient = new MongoClient(this._url, option);

    }

    // async connect(){
    //     // this._conn = await this._mongoClient.connect(
    //     this._conn = await new MongoClient.connect(this._url, { useNewUrlParser: true }
    //     ).catch(err => console.log(err));
    //     //console.log("connect:", this._mongoClient.isConnected());
    // }

    insert(db, collection, ...data) {
        // if(!this._mongoClient.isConnected()){
        //     console.log("Not Connected");
        //     return;
        // }
        // this.connect();
        // if (!this._conn) {
        //     console.log("Not Connected");
        //     return;
        // }
        MongoClient.connect(this._url, this._option, function (err, client) {
            if (err) throw err;
            if (!data.length) return;
            console.log("--------------------------");
            let dbo = client.db(db);
            let _collection = dbo.collection(collection);
            _collection.insertMany(data).then(
                result => { return result }
            ).catch(
                err => console.error(`Failed to insert: ${err}`)
            );
        });

        // console.log(db, collection, data);
    }
}

module.exports = { MongoApi };