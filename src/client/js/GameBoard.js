'use strict';
import * as util from './canvas_utilities.js';

export default class GameBoard {

    /**
     * create GameBoard object
     * @param {HTMLElement} canvas 
     * @param {object} options
     * options contains:
     *  edgeColor: {color}
     *  lineColor: {color}
     *  pieceColor: {color}
     *  backgroundColor/Image: {color/image src}
     *  edge: {number} the distance btw inner boarder and the canvas
     *  lineWidth: {number} the line width
     */
    constructor(canvas, options) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._options = options;
    }

    drawBoard(size) {
        if (this._ctx) {
            //def variables
            let dist = 0;
            let board_width = this._canvas.width;
            let board_height = this._canvas.height;

            let line_length = board_width;
            let line_width = board_width / 425;

            //init state
            util.setStyles(this._ctx, {
                strokeStyle: this._options.lineColor,
                lineWidth: line_width,
            })
            this._ctx.save();

            //clear canvas
            util.clear(this._ctx);
        
            //set options:
            util.setStyles(this._ctx, {
                strokeStyle: this._options.edgeColor,
                fillStyle: this._options.backgroundColor,
            });
            
            //fill background
            util.fillBackground(this._ctx);
            
            //draw edge
            if(this._options.edge){
                //update variable
                let edgeLineWidth = line_width * 2;
                dist = board_width * (this._options.edge / 100) + edgeLineWidth;
                line_length -= 2 * dist;
    
                util.setStyles(this._ctx, { lineWidth: edgeLineWidth });
                util.drawSquare(this._ctx, {x: dist, y: dist}, line_length);
            }
            
            //restore to init
            this._ctx.restore();
            
            //draw lines
            let gap = line_length / size;
            for (let i = 1; i < size; i++) {
                let v_start = { x: i * gap + dist, y: dist };
                let h_start = { x: dist, y: i * gap + dist };

                util.drawVerticalLine(this._ctx, v_start, line_length);
                util.drawHorizontalLine(this._ctx, h_start, line_length);
            }
        }
    }

    setSize(length){
        this._canvas.setAttribute('width', length);
        this._canvas.setAttribute('height', length);
    }
}