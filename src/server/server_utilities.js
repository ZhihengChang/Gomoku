/**
 * Server Utilities
 */
const config = require('../config/config.json');
const db_config = config.db;

const dbHost = db_config.host;
const dbPort = db_config.port;
const dbOption = db_config.option;
const dbType = db_config.type;
const dbApi = db_config.api;
const dbUtil = require(`./${dbApi}`);

//console.log(dbType, dbApi);
console.log("option:", dbOption);
const mongoApi = new dbUtil.MongoApi(dbHost, dbPort, dbOption);

//mongoApi.connect();
// (async () => {
//     await new Promise(resolve => setTimeout(() => resolve(), 2000));
// })();
// mongoApi.connect();
    

mongoApi.insert("testdb", 'documents', {name:"nine"});
mongoApi.insert("testdb", 'documents', {name:"ten"});
//mongoApi.insert("testdb", 'documents', {name:"nine"});

// setTimeout( () => {mongoApi.connect()}, 1000);

