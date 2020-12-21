'use strict';

export default class Shape {

    constructor(canvas, options){
        console.log(canvas);
        console.log(options);
        
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._options = options;
    }

    draw(){
        throw new Error(`${arguments.callee.name} is not implement`);
    }
}