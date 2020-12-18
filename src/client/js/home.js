'use strict';
import * as util from './client_utilities.js';
import Profile from './Profile.js';
import { createPage } from './createPage.js';
import GameBoard from './GameBoard.js';

var DEF_PAGE;

var MIN_SIZE = 14;
var MAX_SIZE = 19;
var EXP_PRLV = 10;
var USER = JSON.parse(sessionStorage.user);

window.onload = () => {

    loadDefaultPage();

    let menu = DEF_PAGE.menu;

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
    clearPage();
    let _homePage = createPage.home();
    util.addDom(document.body, _homePage.div_main);
}

/**
 * load User Profile page
 * NOTE: menu 'Profile' btn onclick
 */
function loadProfilePageHandler() {
    clearPage();
    let _profilePage = createPage.profile();
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
    clearPage();
    let _newGamePage = createPage.newGame();
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

    //new window
    win.location = `${location.origin}/pages/game.html`;
    _menu.btn_home.click();
    
}

/**
 * if no authToken return blank page
 * NOTE: contentloaded event function
 */
function domContentLoadedHandler() {
    let _authToken = sessionStorage.authToken;
    console.log("auth token:" + _authToken);
    if (!_authToken) {
        clearPage();
    }
}

/**
 * Clears user's data in session storage
 * NOTE: unload event function
 */
function pageUnloadHandler() {
    delete sessionStorage.authToken;
    delete sessionStorage.user;
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




//#### helper functions #########################################################################

/**
 * Clear all page content
 */
function clearPage() {
    document.body.innerHTML = '';
}

/**
 * Default Page: Home
 * Load default page when user successfuly loged in
 */
function loadDefaultPage() {
    DEF_PAGE = createPage.home();
    util.addDom(document.body, DEF_PAGE.div_main);
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

/**
 * Calculate player level based on total exp
 * @param {number} exp 
 */
function getLevel(exp) {
    return 1 + (exp / EXP_PRLV);
}

function getRank(rankPoints) {

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