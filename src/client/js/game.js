'use strict';
import * as util from './client_utilities.js';
import { createPage } from './createPage.js';
import GameBoard from './GameBoard.js';

var OPP_FOUND = false;
var TIMEOUT = false;
var DELAY = 100;
var GAMEBOARD;

let _inGame = createPage.inGame();
let _menu = _inGame.menu;
let _display = _inGame.display;
let _canvas = _display.canvas_gameboard;
util.addDom(document.body, _inGame.div_main);

// menu.btn_undo.addEventListener('click', undoLastStepHandler);
// menu.btn_surrender.addEventListener('click', surrenderHandler);
document.addEventListener("DOMContentLoaded", domContentLoadedHandler);
window.addEventListener("unload", pageUnloadHandler);
window.addEventListener('resize', gameBoardFitWindow);
window.addEventListener("message", async (event) => {
    if (event.origin !== location.origin) return;
    let _data = JSON.parse(event.data);
    console.log(_data);

    sessionStorage.user = JSON.stringify(_data.user);
    sessionStorage.match = JSON.stringify(_data.match);
    
    let _gameOptions = await getGameOptions(_data.user);
    console.log(_gameOptions);
    _gameOptions.gameBoard.size = _data.match.boardSize;
    if(!GAMEBOARD) {GAMEBOARD = new GameBoard(_canvas, _gameOptions)};
    redrawGameBoard();
});

_canvas.addEventListener("mousedown", (event) => {
    let coordinate = getMouseCoordinate(_canvas, event);
    GAMEBOARD.drawStep(coordinate);
});


//#### helper functions #########################################################################

async function checkOpponent(){
    if(OPP_FOUND) return;

    // let _action = 'checkOpponent';
    // let _reqBody = util.generateReqBody(_action, USER, matchInfo);
    // let _request = util.generatePOSTReq(_reqBody);
    // let _res = await fetch(`/${_action}`, _request);
    // let _response = await _res.json();
    // console.log(sessionStorage.user);
}


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
    console.log("auth token:" + _authToken);
    if (!_authToken) {
        util.clearPage(_inGame);
    }

    window.opener.postMessage('in game page content loaded');
}

async function pageUnloadHandler(){
    let _match = JSON.parse(sessionStorage.match);
    let _user = JSON.parse(sessionStorage.user);

    if(_match.status == 'In Game'){
        //update current player lost
    }

    if(_match.status != 'Waiting'){
        //update match
        //add to history
    }

    //delete match
    deleteGame(_match);
    
    delete sessionStorage.user;
    delete sessionStorage.match;
}

/**
 * Delete specific match
 * @param {object} match 
 */
async function deleteGame(match){
    let _action = 'deleteGame';
    let _reqBody = util.generateReqBody(_action, {}, match);
    let _request = util.generatePOSTReq(_reqBody);
    await fetch(`/${_action}`, _request);
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

/**
 * Get the user game options
 * if none default game options are returned
 * @param {object} user 
 */
async function getGameOptions(user){
    let _action = 'getGameOptions';
    let _reqBody = util.generateReqBody(_action, user, {});
    let _request = util.generatePOSTReq(_reqBody);
    let _res = await fetch(`/${_action}`, _request);
    let _response = await _res.json();
    console.log(_response);
    
    return _response.data;
}

