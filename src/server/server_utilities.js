'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
    loadPage, getContentType, getRequestBody, 
    sendJsonResponse, isEmpty
};

const MIMETypes = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
}

const basePath = __dirname + '/../';
const clientPath = basePath + '/client/';
const serverPath = basePath + '/server/';

function loadPage(request, response){
    // console.log(request.url);
    
    //localhost:3000
    let filePath = clientPath + request.url;
    if(request.url == '/'){
        filePath = clientPath + '/pages/login.html';
    }

    if(!fs.existsSync(filePath)) {
        // console.log("Not a page");
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

/**
 * write and send json response to client
 * @param {Response} response 
 * @param {string} event 
 * @param {number} code 
 * @param {string} status 
 * @param {object} data 
 */
function sendJsonResponse(response, event, code, status, data){
    response.writeHead(code, {"Content-Type": "application/json"});
    let _data = data || {};
    let _res = {
        event: event,
        status: status,
        data: _data,
    };
    response.write(JSON.stringify(_res));
    response.end();
}

function isEmpty(_obj) {
    if (Array.isArray(_obj) && _obj.length == 0) return true;
    if (_obj instanceof Set && _obj.size == 0) return true;
    if (_obj instanceof Map && _obj.size == 0) return true;

    return (!_obj || Object.keys(_obj).length == 0);
}