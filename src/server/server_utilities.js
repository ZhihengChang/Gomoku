/**
 * Server Utilities
 */
const config = require('../config/config.json');
const db_config = config.db;
const DBApi = require(`./${db_config.api}`).DBApi;


const dbHost = db_config.host;
const dbPort = db_config.port;
const dbName = db_config.database;
const dbOption = db_config.option;
const dbType = db_config.type;

//console.log(dbType, dbApi);
// console.log("option:", dbOption);
const dbApi = new DBApi(dbHost, dbPort, dbName, dbOption);

// let dbConn = dbApi.connect();
// dbConn.then((client) => {dbApi.insert(client, 'documents', {name:"19"})});
// dbConn.then((client) => {dbApi.select(client, 'documents', {name:"18"});});
// dbConn.then((client) => {dbApi.delete(client, 'documents', {name:"19"});});
// dbConn.then((client) => {dbApi.update(client, 'documents', {name:"one"}, {$set: {name: '1'}})});
// console.log(dbApi.currentDB());

dbApi.insert1('documents', {name:"20"});

