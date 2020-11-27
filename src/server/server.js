/**
 * Server Utilities
 */
const http = require('http');
const util = require('./server_utilities');
const config = require('../config/config.json');
const server_config = config.service;
const db_config = config[server_config.dbType];
const dbApi = require(`./${db_config.api}`).dbApi;
const ps = require('./ProxyServer');
const ProxyServer = ps.ProxyServer;

// var proxyServer;
function startService() {
    dbApi.connect(err => {
        if(err){
            console.log(err);
            return;
        }
        
        let proxyServer = new ProxyServer(dbApi);
        
        http.createServer((request, response) => {
            proxyServer.handle_client_requests(request, response);
        }).listen(server_config.port);

    })

    
}

startService();



