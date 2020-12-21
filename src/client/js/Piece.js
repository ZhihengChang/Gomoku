'use strict';
import * as util from './canvas_utilities.js';
import Shape from './Shape.js';

export default class Piece extends Shape{

    /**
     * create GameBoard object
     * @param {HTMLElement} canvas 
     * @param {object} options
     * options contains:
     *  radius: {number}
     *  lineColor: {color}
     *  fillColor: {color}
     *  lineWidth: {number} the line width
     */
    constructor(canvas, options){
        super(canvas, options);
    }

    drawPiece(coordinate){
        let _radius = this._options.radius;
        let _color = this._options.fillColor;
        util.drawCircle(this._ctx, coordinate, _radius, _color);
    }

    setRadius(radius){
        this._options.radius = radius;
    }
}