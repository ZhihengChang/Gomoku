'use strict';
import * as util from '../src/client/js/canvas_utilities.js';
import Piece from '../src/client/js/Piece.js';
import Shape from '../src/client/js/Shape.js'

export default class GameBoard extends Shape{

    _gap; //line gap within the board.
    _dist; //the distence btw the outer border and inner border.
    _edgeLineWidth; //the inner border line width.
    _edgeDist; //the sum of dist and edgeLineWidth.
    _lineWidth; //the regular line width.
    _lineLength; //the inner border line length.

    _stepQueue; //step (coordinates) array.
    _stepQueuePointer;

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
        console.log("gameboard init...");
        super(canvas, options.gameBoard);
        this._piece = new Piece(canvas, options.piece);

        this._gap = 0;
        this._dist = 0;
        this._edgeLineWidth = 0;
        this._edgeDist = 0;
        this._lineWidth = 0;
        this._lineLength = 0;
        this._stepQueue = [];
        this._stepQueuePointer = 0;
  
    }

    draw() {
        this._size = this._options.size;
        this.drawBoard(this._size);
        // this._stepQueue.forEach( step => {
        //     this.drawStep(step);
        // });

        // let gap = this._gap;
        // let dist = this._edgeDist;
        let fullLength = this._stepQueue.length;
        let numOfThread = 2;
        let threadLength = Math.floor(fullLength / numOfThread);
        let leftOver = fullLength - (numOfThread * threadLength);
        let drawers = [];
        let stepQueue = JSON.stringify(this._stepQueue);
        
        let data = {
            gap: this._gap,
            dist: this._edgeDist,
            piece: this._piece,
        }

        for(let i = 0; i < numOfThread; i++){
            drawers.push(new Worker('./pieceDrawer.js'));
        }
        
        for(let i = 0; i < numOfThread; i++){
            data.start = i * threadLength;
            data.end = (i + 1) * threadLength;

            if(i == numOfThread - 1) end += leftOver;
            
            // drawers[i].postMessage({start, end, gap, dist, stepQueue});
            drawers[i].postMessage(data);
        }
        
    }


    drawBoard(size) {
        if (this._ctx) {
            //def variables
            let board_width = this._canvas.width;
            this._lineLength = board_width;
            this._lineWidth = board_width / 425;

            //init state
            util.setStyles(this._ctx, {
                strokeStyle: this._options.lineColor,
                lineWidth: this._lineWidth,
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
                this._edgeLineWidth = this._lineWidth * 2;
                this._dist = board_width * (this._options.edge / 100) + this._edgeLineWidth;
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

    drawStep(position){
        this._stepQueue.push(position);
        this._piece.setRadius(this._radius);
        let coordinate = {
            x: position.col * this._gap + this._edgeDist,
            y: position.row * this._gap + this._edgeDist,
        }
        this._piece.drawPiece(coordinate);
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