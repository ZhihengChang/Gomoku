'use strict';
import * as util from './client_utilities.js';
import { createPage } from './createPage.js';
import GameBoard from './GameBoard.js';

var TIMEOUT = false;
var DELAY = 100;
var GAMEBOARD;

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

var MATCH = JSON.parse(localStorage.match);
_default_options.gameBoard.size = MATCH.boardSize;


let _inGame = createPage.inGame();
let _menu = _inGame.menu;
let _display = _inGame.display;
let _canvas = _display.canvas_gameboard;
util.addDom(document.body, _inGame.div_main);

// menu.btn_undo.addEventListener('click', undoLastStepHandler);
// menu.btn_surrender.addEventListener('click', surrenderHandler);
document.addEventListener("DOMContentLoaded", domContentLoadedHandler);
window.addEventListener("unload", pageUnloadHandler);

if(!GAMEBOARD) {GAMEBOARD = new GameBoard(_canvas, _default_options)};
redrawGameBoard();

window.addEventListener('resize', gameBoardFitWindow);

_canvas.addEventListener("mousedown", (event) => {
    let coordinate = getMouseCoordinate(_canvas, event);
    GAMEBOARD.drawStep(coordinate);
});

function getMouseCoordinate(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let position = GAMEBOARD.getRelativePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    });
    return position;
}

function gameBoardFitWindow() {
    clearTimeout(TIMEOUT);
    TIMEOUT = setTimeout(redrawGameBoard, DELAY);
}

function domContentLoadedHandler() {
    let _authToken = localStorage.authToken;
    let _match = localStorage.match;
    console.log("auth token:" + _authToken);
    console.log(MATCH);
    if (!_authToken && !_match) {
        util.clearPage(_inGame);
    }
}

function pageUnloadHandler(){
    delete localStorage.authToken;
    delete localStorage.match;
}

/**
 * recreate the game board based on the window size
 */
function redrawGameBoard(){
    let curWidth = _display.div_game.clientWidth;
    let curHeight = _display.div_game.clientHeight - _display.div_statbar.clientHeight;
    GAMEBOARD.setSize(Math.min(curWidth, curHeight));
    GAMEBOARD.draw();
}

