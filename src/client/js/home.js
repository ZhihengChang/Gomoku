'use strict';
import * as util from './client_utilities.js';
import Profile from './Profile.js';
import { createPage } from './createPage.js';


var CUR_PAGE;

var MIN_SIZE = 14;
var MAX_SIZE = 19;

var USER = JSON.parse(localStorage.user);

window.onload = () => {

    loadDefaultPage();

    let menu = CUR_PAGE.menu;

    menu.btn_home.addEventListener('click', loadHomePageHandler);

    menu.btn_profile.addEventListener('click', loadProfilePageHandler);

    menu.btn_create.addEventListener('click', loadCreateGamePageHandler);

}

document.addEventListener("DOMContentLoaded", domContentLoadedHandler);
window.addEventListener("unload", pageUnloadHandler);


//#### Event handlers ###########################################################################

/**
 * load Home page, game table
 * NOTE: menu 'Home' btn onclick
 */
function loadHomePageHandler() {
    util.clearPage(CUR_PAGE);
    let _homePage = createPage.home();
    CUR_PAGE = _homePage;
    util.addDom(document.body, _homePage.div_main);

    loadGameTable.call(_homePage.display);
    //add listener to join and spec

}

/**
 * load User Profile page
 * NOTE: menu 'Profile' btn onclick
 */
function loadProfilePageHandler() {
    util.clearPage(CUR_PAGE);
    let _profilePage = createPage.profile();
    CUR_PAGE = _profilePage;
    util.addDom(document.body, _profilePage.div_main);

    let _display = _profilePage.display;

    let _profile = new Profile(USER);
    _profile.loadProfile(_display);

}

/**
 * load Create Game page
 * NOTE: menu 'Create' btn onclick
 */
function loadCreateGamePageHandler() {
    util.clearPage(CUR_PAGE);
    let _newGamePage = createPage.newGame();
    CUR_PAGE = _newGamePage;
    util.addDom(document.body, _newGamePage.div_main);

    let display = _newGamePage.display;
    let p_size = _newGamePage.display.p_size;

    display.a_prev.addEventListener('click', sizeChangeHandler.bind(p_size, -1));
    display.a_next.addEventListener('click', sizeChangeHandler.bind(p_size, +1));

    display.inp_create.addEventListener('click', createGameHandler.bind(_newGamePage));
}

/**
 * Send createGame request to server and proceed to in game.
 * NOTE: Create btn onclick function
 */
async function createGameHandler() {
    const win = window.open('about:blank');

    let _menu = this.menu;
    let _display = this.display;
    let _board_size = _display.p_size;

    let _data = {
        boardSize: _board_size.dataset.size,
        undo: _display.inp_checkbox_undo.checked,
        chat: _display.inp_checkbox_chat.checked,
        spectate: _display.inp_checkbox_spec.checked,
    }

    let _reqBody = util.generateReqBody('createGame', USER, _data);
    let _request = util.generatePOSTReq(_reqBody);
    let _res = await fetch('/createGame', _request);
    let _response = await _res.json();

    if(_response.status == 'ERROR'){
        alert(_response.data.message);
        return;
    }

    localStorage.match = JSON.stringify(_response.data);

    //new window
    win.location = `${location.origin}/pages/game.html`;
    _menu.btn_home.click();
}

/**
 * if no authToken return blank page
 * NOTE: contentloaded event function
 */
function domContentLoadedHandler() {
    let _authToken = localStorage.authToken;
    console.log("auth token:" + _authToken);
    if (!_authToken) {
        util.clearPage(CUR_PAGE);
    }
}

/**
 * Clears user's data in session storage
 * NOTE: unload event function
 */
function pageUnloadHandler() {
    delete localStorage.authToken;
    delete localStorage.user;
}

/**
 * Change the board size in the new game display
 * NOTE: onclick function for prev & next btn
 * @param {number} delta 
 */
function sizeChangeHandler(delta) {
    let p_size = this;
    let _size = p_size.dataset.size;

    if (delta < 0 && _size == MIN_SIZE) return;
    if (delta > 0 && _size == MAX_SIZE) return;

    _size = +_size + delta;
    p_size.dataset.size = _size;
    p_size.textContent = `${_size} X ${_size}`;
}


function actionsHandler(){
    
}



//#### helper functions #########################################################################

/**
 * Default Page: Home
 * Load default page when user successfuly loged in
 */
function loadDefaultPage() {
    CUR_PAGE = createPage.home();
    util.addDom(document.body, CUR_PAGE.div_main);
}

/**
 * list all matches in the matches collection (db) on the home: gtable
 * ISSUE: when there are too many games (rows)
 */
async function loadGameTable(){
    let _gtable = this;
    util.clearAllRows(_gtable.tbd_gtable_body);

    let _action = 'loadGameTable';
    //TODO: data should contain search query/criteria for selecting game table
    let _data = {}; 

    let _reqBody = util.generateReqBody(_action, USER, _data);
    let _request = util.generatePOSTReq(_reqBody);
    let _res = await fetch(`/${_action}`, _request);
    let _response = await _res.json();

    let _matches = _response.data;
    for(let match of _matches){
        console.log(match);
        let _row = util.createTableRow({
            player: match.playerUsername,
            lv: util.getPlayerLevel(match.playerExp),
            status: match.status,
            undo: match.undo? 'On': 'Off',
            chat: match.chat? 'On': 'Off',
            boardSize: `${match.boardSize} X ${match.boardSize}`,
            spectating: match.spectating,
        }, setTdColor);
        util.addDom(_gtable.tbd_gtable_body, _row);
    }

    _gtable.tbd_gtable_body.addEventListener('click', actionsHandler.bind(_gtable));
}

/**
 * add table row callback function: set status, switch colors
 * @param {HTMLElement} cell 
 */
function setTdColor(cell) {
    if (['undo', 'chat', 'status'].includes(cell.dataset.key)) {
        cell.classList.add(cell.textContent.replace(' ', '_').toLowerCase());
    }
}


//del this
// console.log(location);
// let socket = new WebSocket(`ws://${location.host}/chat`);
// home.menu.btn_profile.addEventListener('click', function () {
//     socket.send(sessionStorage.user);
// })

// socket.onmessage = function (event) {
//     let message = event.data;
//     alert(message);
// }