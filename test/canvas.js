'use strict';
import * as util from '../src/client/js/client_utilities.js';
import GameBoard from '../src/client/js/GameBoard.js';

let canvas = util.createDom('canvas', {
    style:{
        // backgroundColor: 'rgb(204, 147, 82)',
        display: 'block',
        border: '2px solid black',
    }
});

util.addDom(document.body, canvas);
let minLength = Math.min(window.innerWidth, window.innerHeight);
canvas.setAttribute('width', minLength);
canvas.setAttribute('height', minLength);

let board = new GameBoard(canvas, {
    edge: 3, //percentage
    backgroundColor: 'rgb(204, 147, 82)',
});

board.drawBoard(19);

window.addEventListener('resize', function(){
    minLength = Math.min(window.innerWidth, window.innerHeight);
    canvas.setAttribute('width', minLength);
    canvas.setAttribute('height', minLength);
    board.drawBoard(19);
})






// let ctx = canvas.getContext('2d');

// let size = 14;
// let gap = canvas.width / size;
// for(let i = 1; i < size; i++){
//     let v_start = {x: i * gap, y: 0};
//     let h_start = {x: 0, y: i * gap};
//     drawVerticalLine(ctx, v_start, canvas.width);
//     drawHorizontalLine(ctx, h_start, canvas.width);
// }

// function drawLine(ctx, start, end){
//     ctx.beginPath();
//     ctx.moveTo(start.x, start.y);
//     ctx.lineTo(end.x, end.y);
//     ctx.stroke();
//     ctx.closePath();
// }

// function drawVerticalLine(ctx, start, length){
//     drawLine(ctx, start, {x: start.x, y: start.y + length});
// }

// function drawHorizontalLine(ctx, start, length){
//     drawLine(ctx, start, {x: start.x + length, y: start.y});
// }


