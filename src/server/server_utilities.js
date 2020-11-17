/**
 * Server Utilities
 */
const http = require('http');
const config = require('../config/config.json');
const server_config = config.service;
const db_config = config[server_config.dbType];

const dbApi = require(`./${db_config.api}`).dbApi;
module.exports = {startService};

function startService() {
    dbApi.connect(err => {
        if(err){
            console.log(err);
            return;
        }

        http.createServer((request, response) => {
            console.log(request.url);
            //handle_insert_request(request, response);
            //handle_delete_request(request, response);
        }).listen(server_config.port);

    })

    
}

async function handle_insert_request(req, res){
    let result = await dbApi.insert('documents', {name:'22'});
    console.log(result);
}

async function handle_delete_request(req, res){
    let result = await dbApi.delete('documents', {name:'22'});
    console.log("deleteCount:", result.result.n);
}

async function handle_select_request(req, res){
    let result = await dbApi.select('documents', {name:'18'});
    console.log(result);
}

async function handle_update_request(req, res){
    let result = await dbApi.update('documents', {name:"one"}, {$set: {name: '1'}});
    console.log(result);
}


