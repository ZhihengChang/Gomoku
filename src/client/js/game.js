'use strict';
import * as util from './client_utilities.js';
import {createPage} from './createPage.js';
import GameBoard from './GameBoard.js';

var BORDER = 1.5;

let _default_options = {
    edge: 3,
    lineColor: 'black',
    edgeColor: 'black',
    backgroundColor: 'rgb(204, 147, 82)',
}

let _inGame = createPage.inGame();
util.addDom(document.body, _inGame.div_main);


let _display = _inGame.display;
let _canvas = _display.canvas_gameboard;

let _gameBoard = new GameBoard(_canvas, _default_options);
gameBoardFitWindow();

window.addEventListener('resize', gameBoardFitWindow);


function gameBoardFitWindow(){
    let curWidth = _display.div_game.clientWidth;
    let curHeight = _display.div_game.clientHeight - _display.div_statbar.clientHeight;
    _gameBoard.setSize(Math.min(curWidth, curHeight));
    _gameBoard.drawBoard(14);
}
