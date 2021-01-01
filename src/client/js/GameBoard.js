'use strict';
import * as util from './canvas_utilities.js';


export default class GameBoard{

    _gap; //line gap within the board.
    _dist; //the distence btw the outer border and inner border.
    _edgeLineWidth; //the inner border line width.
    _lineWidth; //the regular line width.
    _lineLength; //the inner border line length.

    _stepQueue; //step (coordinates) array.
    // _firstTask; //stepQueue drawing process thread 1
    // _secondTask; //stepQueue drawing process thread 2

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
    constructor(canvas, options){
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');

        this._boardOptions = options.gameBoard;
        this._pieceOptions = options.piece;

        this._stepQueue = [];
        // this._firstTask = false;
        // this._secondTask = false;
    }
 
    draw(){
        this._size = this._boardOptions.size;
        this.drawBoard(this._size);
        this.drawStepQueue();
    }

    drawStepQueue(){
        if (this._stepQueue.length == 0) return;

        // let _maxSteps = 10;
        // let _totalSteps =  this._stepQueue.length;

        // if ( _totalSteps >= _maxSteps ) {
            
        //     if(this._firstTask) {clearTimeout(this._firstTask)};
        //     this._firstTask = setTimeout(() => {
        //         Array.from(this._stepQueue.slice(1, Math.floor(_totalSteps/2)))
        //                 .forEach(_step => {this.drawStep(_step, true);
        //                     console.log('1');
        //                 });
        //     });
            
        //     if(this._secondTask) {clearTimeout(this._secondTask)};
        //     this._secondTask = setTimeout(() => {
        //         Array.from(this._stepQueue.slice(Math.floor(_totalSteps/2), _totalSteps))
        //                 .forEach(_step => {this.drawStep(_step, true);
        //                     console.log('2');
        //                 });
        //     });

        //     return;
        // };

        this._stepQueue.forEach(_step => this.drawStep(_step, true));
    }

    drawBoard(size) {
        if (this._ctx) {
            //def variables
            let board_width = this._canvas.width;
            this._lineLength = board_width;
            this._lineWidth = board_width / 425;

            //init state
            util.setStyles(this._ctx, {
                strokeStyle: this._boardOptions.lineColor,
                lineWidth: this._lineWidth,
            })
            this._ctx.save();

            //clear canvas
            util.clear(this._ctx);
        
            //set options:
            util.setStyles(this._ctx, {
                strokeStyle: this._boardOptions.edgeColor,
                fillStyle: this._boardOptions.backgroundColor,
            });
            
            //fill background
            util.fillBackground(this._ctx);
            
            //draw edge
            if(this._boardOptions.edge){
                //update variable
                this._edgeLineWidth = this._lineWidth * 2;
                this._dist = board_width * (this._boardOptions.edge / 100) + this._edgeLineWidth;
                this._lineLength -= 2 * this._dist;
                this._edgeDist = this._dist + this._edgeLineWidth
    
                util.setStyles(this._ctx, { lineWidth: this._edgeLineWidth });
                util.drawSquare(this._ctx, {x: this._dist, y: this._dist}, this._lineLength);
            }
            
            //restore to init
            this._ctx.restore();
            
            //draw lines
            this._gap = this._lineLength / size;
            for (let i = 1; i < size; i++) {
                let v_start = { x: i * this._gap + this._dist, y: this._dist };
                let h_start = { x: this._dist, y: i * this._gap + this._dist };

                util.drawVerticalLine(this._ctx, v_start, this._lineLength);
                util.drawHorizontalLine(this._ctx, h_start, this._lineLength);
            }

            this._radius = ((this._lineLength / this._size) / 2) * 0.8;
        }
    }

    drawStep(position, redraw){
        if(!redraw){
            this._stepQueue.push(position);
        }
        let coordinate = {
            x: position.col * this._gap + this._edgeDist,
            y: position.row * this._gap + this._edgeDist,
        }
        this.drawPiece(coordinate);
    }

    drawPiece(coordinate){
        let _color = this._pieceOptions.fillColor;
        util.drawCircle(this._ctx, coordinate, this._radius, _color);
        console.log("drawPiece: " + coordinate);
    }

    getRelativePosition(coordinate){
        let position = {
            row: Math.round((coordinate.y - this._edgeDist) / this._gap),
            col: Math.round((coordinate.x - this._edgeDist) / this._gap),
        };
        console.log(position);
        return position;
    }

    setSize(length){
        this._canvas.setAttribute('width', length);
        this._canvas.setAttribute('height', length);
    }
}