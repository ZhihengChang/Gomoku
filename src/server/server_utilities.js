'use strict';
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');


module.exports = {
    loadPage, getContentType, 
    getRequestBody, sendJsonResponse, 
    createBase64JWT,
    isEmpty,
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

/**
 * Get the corresponding MIME type from the given file path
 * @param {string} filePath 
 */
function getContentType(filePath){
    // console.log(filePath);
    if(filePath){
        let key = filePath.split('.').slice(-1)[0];
        // console.log("key:", key);
        return MIMETypes[key];
    }
    return undefined;
}

/**
 * Get the JSON request body
 * @param {request} request 
 * @param {function} callBack 
 */
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

/**
 * Check the given object/array/map/set is empty
 * @param {*} _obj 
 */
function isEmpty(_obj) {
    if (Array.isArray(_obj) && _obj.length == 0) return true;
    if (_obj instanceof Set && _obj.size == 0) return true;
    if (_obj instanceof Map && _obj.size == 0) return true;

    return (!_obj || Object.keys(_obj).length == 0);
}

/**
 * Create base64 JWT
 * @param {string} header 
 * @param {string} payload 
 * @param {string} secretKey 
 * @param {boolean} toEnc 
 */
function createBase64JWT(header, payload, secretKey, toEnc = true) {

    let _base64Header = (!toEnc)? header: getEncoded(header, 'Base64');
    let _base64Payload = (!toEnc)? payload: getEncoded(payload, 'Base64');
    let _signature = CryptoJS.HmacSHA256(`${_base64Header}.${_base64Payload}`, secretKey);
    // console.log(`_signature: ${_signature}`);
    // console.log(`_base64Payload:${_base64Payload}`);
    // console.log(`_base64Payload dec str:${JSON.parse(this.getDecoded(_base64Payload, 'Base64'))}`);

    let _base64Sign = CryptoJS.enc.Base64.stringify(_signature);
    // let _base64Sign = getBase64Encoded(_signature);

    return `${_base64Header}.${_base64Payload}.${_base64Sign}`.trim();
}

function getEncoded( rawStr, encType ) {
    let _wordArray = CryptoJS.enc.Utf8.parse(rawStr);
    return CryptoJS.enc[encType].stringify(_wordArray); 
}

function getDecoded( encStr, encType ) {
    let _wordArray = CryptoJS.enc[encType].parse( encStr);
    return _wordArray.toString( CryptoJS.enc.Utf8 );
}