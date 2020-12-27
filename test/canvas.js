'use strict';
import * as util from '../src/client/js/client_utilities.js';
import { createPage } from '../src/client/js/createPage.js';
import GameBoard from './GameBoard.js';

var TIMEOUT = false;
var DELAY = 150;

let _default_options = {
    gameBoard: {
        size: 14,
        edge: 3,
        lineColor: 'black',
        edgeColor: 'black',
        backgroundColor: 'rgb(204, 147, 82)',
    },
    piece: {
        radius: 20,
        lineColor: 'black',
        fillColor: 'white',
    }
}

let _inGame = createPage.inGame();
util.addDom(document.body, _inGame.div_main);

let _display = _inGame.display;
let _canvas = _display.canvas_gameboard;

let _gameBoard = new GameBoard(_canvas, _default_options);
redrawGameBoard();

window.addEventListener('resize', gameBoardFitWindow);

_canvas.addEventListener("mousedown", (event) => {
    let coordinate = getMouseCoordinate(_canvas, event);
    _gameBoard.drawStep(coordinate);
});

function getMouseCoordinate(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let position = _gameBoard.getRelativePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    });
    return position;
}

function gameBoardFitWindow() {
    clearTimeout(TIMEOUT);
    TIMEOUT = setTimeout(redrawGameBoard, DELAY);
}

/**
 * recreate the game board based on the window size
 */
function redrawGameBoard(){
    let curWidth = _display.div_game.clientWidth;
    let curHeight = _display.div_game.clientHeight - _display.div_statbar.clientHeight;
    _gameBoard.setSize(Math.min(curWidth, curHeight));
    _gameBoard.draw();
}
