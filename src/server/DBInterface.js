'use strict';
class DBInterface{

    constructor(){}

    connect(){
        throw new Error(`${arguments.callee.name} is not implement`);
    }

    close(){
        throw new Error(`${arguments.callee.name} is not implement`)
    }

    insert(){
        throw new Error(`${arguments.callee.name} is not implement`);
    }

    select(){
        throw new Error(`${arguments.callee.name} is not implement`);
    }

    update(){
        throw new Error(`${arguments.callee.name} is not implement`);
    }

    replace(){
        throw new Error(`${arguments.callee.name} is not implement`);
    }

    delete(){
        throw new Error(`${arguments.callee.name} is not implement`);
    }

    count(){
        throw new Error(`${arguments.callee.name} is not implement`);
    }

}

module.exports = DBInterface;






