'use strict';
import * as util from './client_utilities.js';
import { createPage } from './createPage.js';
import GameBoard from './GameBoard.js';

var OPP_FOUND = false;
var TIMEOUT = false;
var DELAY = 100;
var GAMEBOARD;
var SOCKET;

let INGAME = createPage.inGame();
let _menu = INGAME.menu;
let _display = INGAME.display;
let _canvas = _display.canvas_gameboard;
util.addDom(document.body, INGAME.div_main);
  
let defaultOpenTab = _display.btn_chat;
_display.btn_chat.addEventListener('click', openTab);
_display.btn_setting.addEventListener('click', openTab);
// menu.btn_undo.addEventListener('click', undoLastStepHandler);
// menu.btn_surrender.addEventListener('click', surrenderHandler);

document.addEventListener("DOMContentLoaded", domContentLoadedHandler);
window.addEventListener("unload", pageUnloadHandler);
// window.addEventListener('resize', gameBoardFitWindow);
window.addEventListener('resize', redrawGameBoard);
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

    handleInGame();
});

defaultOpenTab.click();

//#### main functions ############################################################################

/**
 * Handle the communication with the server during the game process
 * NOTE: check if the user is owner or joined player
 */
async function handleInGame(){
    let _match = JSON.parse(sessionStorage.match);
    let _user = JSON.parse(sessionStorage.user);

    SOCKET = new WebSocket(`ws://${location.host}/game`);

    if(_user.username == _match.playerName){
        //current user is owner
        SOCKET.onopen = function(e) {
            console.log("[open] Connection established as owner");
            util.sendWSRequest(SOCKET, 'newRoom', _user, { matchId: _match.matchId });
        }
    }else if(_user.username == _match.opponent){
        //the user is joined player
        SOCKET.onopen = function(e) {
            console.log("[open] Connection established as joined player");
            util.sendWSRequest(SOCKET, 'addPlayerToRoom', _user, { matchId: _match.matchId });
        }
    }else{
        //spec
        SOCKET.onopen = function(e) {
            console.log("[open] Connection established as spectator");
            //req add to corresponding game spec list
        }
    }

    handleWSResponse();
}

function handleWSResponse(){
    SOCKET.onmessage = function(e) {
        let _response = JSON.parse(e.data);
        console.log('Server Response:', _response);

        switch(_response.message){
            //init queue timer
            case 'Room Created': 
                startQueue(); 
                break;

            //set who goes first, and other small in game settings
            case 'Opponent Joined':
            case 'Room Joined': 
                setInGameOptions(); 
                break;

            case 'Match Start':
                startGame();
                break;
            
            default:
                console.log('Unhandled:', _response.message);
                break;
        }
    }
}

function startQueue(){
    console.log('Start Queue!');
    //start queue timer
}

function setInGameOptions(){
    console.log('Opponent Joined!');
    console.log('Setting InGame Options!');
    //chose first
    let _action = 'setFirst';
    //get first
    //NOTE: for now by default is owner

}

function startGame(){
    console.log('Match Start!');
    //reset countdown timer
    //enable total time timer
    //enable chat
    //change status waiting -> whos turn
}

//#### Place Piece functions ######################################################################

function enablePlacePiece(){
    _canvas.addEventListener("mousedown", placePiece, false);
}

function disablePlacePiece(){
    // For all major browsers, except IE 8 and earlier
    if (_canvas.removeEventListener) {                   
        _canvas.removeEventListener("mousedown", placePiece);
    } else if (x.detachEvent) {    
        _canvas.detachEvent("mousedown", placePiece);
    }
}

function placePiece(event){
    let coordinate = getMouseCoordinate(_canvas, event);
    GAMEBOARD.drawStep(coordinate);
}

function getMouseCoordinate(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let position = GAMEBOARD.getRelativePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    });
    return position;
}

//#### onload/unload functions #####################################################################

function domContentLoadedHandler() {
    let _authToken = localStorage.authToken;
    console.log("auth token:" + _authToken);
    if (!_authToken) {
        util.clearPage(INGAME);
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
    
    SOCKET.close();
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

//#### helper functions ###########################################################################

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

function openTab(event) {

    let _tab;
    let _tabName = event.target.textContent;
    
    let _tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < _tabcontent.length; i++) {
        let _content = _tabcontent[i];
        util.hideDom(_content);
        if(_content.classList.contains(_tabName)){
            _tab = _content;
        }
        // console.log(_tabcontent[i].classList);
    }
    let tablinks = document.getElementsByClassName("tablinks");
    console.log(_tabcontent);
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    util.showDom(_tab);
    event.currentTarget.className += " active";
}

function gameBoardFitWindow() {
    clearTimeout(TIMEOUT);
    TIMEOUT = setTimeout(redrawGameBoard, DELAY);
}

