'use strict';

export {
    drawLine, drawVerticalLine, drawHorizontalLine, 
    drawSquare, fillBackground,
    setStyles, clear
};

/**
 * 
 * @param {canvas context} ctx 
 * @param {object} styles 
 */
function setStyles(ctx, styles){
    for(const style in styles){
        ctx[style] = styles[style];
    }
}

function drawLine(ctx, start, end){
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.closePath();
}

function drawVerticalLine(ctx, start, length){
    drawLine(ctx, start, {x: start.x, y: start.y + length});
}

function drawHorizontalLine(ctx, start, length){
    drawLine(ctx, start, {x: start.x + length, y: start.y});
}

function drawSquare(ctx, start, length){
    ctx.strokeRect(start.x, start.y, length, length);
}

function clear(ctx){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillBackground(ctx){
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
