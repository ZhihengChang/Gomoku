// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27018/testdb');
// mongoose.connection.once('open', function(){
//     console.log('Connection has been made.');
// }).on('error', function(error){
//     console.log('connection error: ', error);
// });

const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27018';
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

mongoClient.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected Successfully");
    const db = mongoClient.db('testdb');
    insertDocuments(db, function(){
        mongoClient.close();
    });
});

const insertDocuments = function (db, callback) {
    const collection = db.collection('documents');
    collection.insertMany([
        { name: 'one' }, 
        { name: 'two' }, 
        { name: 'three' }
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}
