'use strict';
//import * as db_util from '../../src/server/db_utilities'


const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27018';
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

mongoClient.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected Successfully");
    //mongoClient.close();
});

const db = mongoClient.db('testdb');
insertData(db, 'documents', {name:'eight'});


function insertData(db, collection, ...data) {
    if(!data.length) return;

    let _collection = db.collection(collection);
    _collection.insertMany(data).then(
        result => {return result;}
    ).catch(
        err => console.error(`Failed to insert: ${err}`)
    );
}
