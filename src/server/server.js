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
        
        let httpServer = http.createServer((request, response) => {
            proxyServer.handle_http_requests(request, response);
            // proxyServer.handle_webSocket_requests(request, response);
        });
        
        const wss_game = new ws.Server({noServer: true});
        const wss_chat = new ws.Server({noServer: true});
        //proxyServer.addWebSocketServer('game', wss);
        httpServer.on('upgrade', (request, socket, head) => {
            proxyServer.handle_wss_requests(wss_game, request, socket, head);
        });

        httpServer.listen(server_config.port);

    })

    
}

startService();



