/**
 * Server Utilities
 */
const http = require('http');
const ws = new require('ws');
const util = require('./server_utilities');
const config = require('../config/config.json');
const server_config = config.service;
const db_config = config[server_config.dbType];
const dbApi = require(`./${db_config.api}`).dbApi;
const ProxyServer = require('./ProxyServer');

// var proxyServer;
function startService() {
    console.log('Starting Server...');
    console.log('Connecting to DataBase...');
    dbApi.connect(err => {
        if(err){
            console.log(err);
            return;
        }

        console.log('Starting Proxy Server...');
        let proxyServer = new ProxyServer(dbApi);
        
        let httpServer = http.createServer((request, response) => {
            proxyServer.handle_http_requests(request, response);
        });
        
        const wss_game = new ws.Server({noServer: true});
        const wss_chat = new ws.Server({noServer: true});

        httpServer.on('upgrade', (request, socket, head) => {
            console.log('Upgrade to WS Connection');
            if(request.url == '/game'){
                proxyServer.handle_wss_requests(wss_game, request, socket, head);
            }
            
        });
        
        console.log(`Server is ON: port ${server_config.port}`);
        httpServer.listen(server_config.port);
    })
}

startService();



