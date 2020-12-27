'use strict';

self.onmessage = function(event) {
    console.log(event.data);
}

function drawPieces(start, end, gap, dist, stepQueue){

    for(let i = start; i < end; i++){
        let position = stepQueue[i];
        let coordinate = {
            x: position.col * gap + dist,
            y: position.row * gap + dist,
        }
    }
    
    this._piece.drawPiece(coordinate);
}