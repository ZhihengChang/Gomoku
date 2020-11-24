/**
 * Server Utilities
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const config = require('../config/config.json');
const server_config = config.service;
const db_config = config[server_config.dbType];

const dbApi = require(`./${db_config.api}`).dbApi;
module.exports = {startService};

const MIMETypes = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
}

const basePath = __dirname + '/../';
const clientPath = basePath + '/client/';
const serverPath = basePath + '/server/';

function startService() {
    dbApi.connect(err => {
        if(err){
            console.log(err);
            return;
        }

        http.createServer((request, response) => {
            // console.log(request.url);
            handle_client_requests(request, response);
        }).listen(server_config.port);

    })

    
}

function handle_client_requests(request, response){

    console.log(request.url);
    loadPage(request, response);
    if(request.method === 'POST'){
        getRequestBody(request, reqBody => {
            console.log(reqBody);
            response.end('ok');
        })
        
    }
}

function loadPage(request, response){
    // console.log(request.url);
    
    //localhost:3000
    let filePath = clientPath + request.url;
    if(request.url == '/'){
        filePath = clientPath + '/pages/login.html';
    }

    if(!fs.existsSync(filePath)) {
        console.log("Not a page");
        return;
    }

    let contentType = getContentType(filePath);

    try{
        response.writeHeader(200, {'content-type': contentType});
        response.write(fs.readFileSync(filePath));
        response.end();
    }catch(err){
        console.log(err);
        response.writeHeader(404);
        response.end("Page Not Found");
    }
}

function getContentType(filePath){
    // console.log(filePath);
    if(filePath){
        let key = filePath.split('.').slice(-1)[0];
        // console.log("key:", key);
        return MIMETypes[key];
    }
    return undefined;
}

async function getRequestBody(request, callBack){
    let body = '';
    request.on('data', chunk =>{
        body += chunk.toString();
    });
    request.on('end', () => {
        callBack(JSON.parse(body));
    });

}

