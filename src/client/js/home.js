'use strict';
import * as util from './client_utilities.js';
import { createPage } from './createPage.js';


var CUR_PAGE;
var WIN_GAME;

var MIN_SIZE = 14;
var MAX_SIZE = 19;

var MATCH;
var USER;

CUR_PAGE = createPage.home();
util.addDom(document.body, CUR_PAGE.div_main);

window.onload = () => {

    let menu = CUR_PAGE.menu;

    menu.btn_home.addEventListener('click', loadHomePageHandler);

    menu.btn_profile.addEventListener('click', loadProfilePageHandler);

    menu.btn_create.addEventListener('click', loadCreateGamePageHandler);

    if(localStorage.user) USER = JSON.parse(localStorage.user);

    if(USER) menu.btn_home.click(); //need pulling to replace: load matches for gtable

}

document.addEventListener("DOMContentLoaded", domContentLoadedHandler);
window.addEventListener("unload", pageUnloadHandler);
window.addEventListener("message", (event) => {
    console.log('recived message: ', event.data);
    WIN_GAME.postMessage(JSON.stringify({ 
        user: USER, 
        match: MATCH
    }), location.origin);
});


//#### Event handlers ###########################################################################

/**
 * load Home page, game table
 * NOTE: menu 'Home' btn onclick
 */
function loadHomePageHandler() {
    console.log('load home page ...')
    util.clearPage(CUR_PAGE);
    let _homePage = createPage.home();
    CUR_PAGE = _homePage;
    util.addDom(document.body, _homePage.div_main);

    loadGameTable.call(_homePage.display);
    //disable all join when USER is in game

}

/**
 * load User Profile page
 * NOTE: menu 'Profile' btn onclick
 */
async function loadProfilePageHandler() {
    util.clearPage(CUR_PAGE);
    let _profilePage = createPage.profile();
    CUR_PAGE = _profilePage;
    util.addDom(document.body, _profilePage.div_main);

    let _display = _profilePage.display;
    let _userdata = await getUserData(USER.userId);
    console.log(_userdata);
    loadProfile(_display, _userdata);
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
    WIN_GAME = window.open('about:blank');
    WIN_GAME.blur();

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
        WIN_GAME.close();
        setTimeout(()=>{alert(_response.data.message)});
        return;
    }
    
    MATCH = _response.data;

    //new window
    WIN_GAME.location = `${location.origin}/pages/game.html`;

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
        console.log('auth token not found!');
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

/**
 * Handle 'join' btn and 'spec' btn
 * @param {*} event 
 */
function actionsHandler(event){
    let _gtable = this;
    event = event || window.event;
    // event.target = event.target || event.srcElement;

    let element = event.target;

    if (element.nodeName === "BUTTON") {
        if (/join/.test(element.className)){
            //handle join
            let _matchInfo = util.getMatchInfo(element);
            // console.log(_matchInfo);
            handleJoin(_matchInfo);
        }
        
        else if (/spec/.test(element.className)){
            //handle spec
            alert('spec the game');
            handleSpec();
        }
    }
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

async function handleJoin(matchInfo){
    WIN_GAME = window.open('about:blank');
    
    let _action = 'joinGame';
    let _reqBody = util.generateReqBody(_action, USER, matchInfo);
    let _request = util.generatePOSTReq(_reqBody);
    let _res = await fetch(`/${_action}`, _request);
    let _response = await _res.json();
    console.log(_response);

    if(_response.status == 'ERROR'){
        WIN_GAME.close();
        setTimeout(()=>{alert(_response.data.message)});
        return;
    }

    MATCH = _response.data;
    WIN_GAME.location = `${location.origin}/pages/game.html`;
}

/**
 * list all matches in the matches collection (db) on the home: gtable
 * ISSUE: when there are too many games (rows)
 */
async function loadGameTable(){
    console.log('load game table ...')
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
            ID: match.matchId,
            player: match.playerName,
            lv: util.getPlayerLevel(match.playerExp),
            status: match.status,
            undo: match.undo? 'On': 'Off',
            chat: match.chat? 'On': 'Off',
            boardSize: `${match.boardSize} X ${match.boardSize}`,
            spectating: match.spectating,
        }, setTdColor);
        util.addDom(_gtable.tbd_gtable_body, _row);
    }

    _gtable.tbd_gtable_body.onclick = actionsHandler.bind(_gtable);
}

/**
 * get user information of specific user
 * @param {number} userId 
 */
async function getUserData(userId){
    console.log('get user data ...');
    
    let _data;
    if(userId) _data = { userId };
    let _action = 'getUser';

    let _reqBody = util.generateReqBody(_action, USER, _data);
    let _request = util.generatePOSTReq(_reqBody);
    let _res = await fetch(`/${_action}`, _request);
    let _response = await _res.json();
    
    return _response.data;
}

/**
 * load user data into the given profile display
 * @param {object} profileDisplay 
 * @param {object} userData 
 */
function loadProfile(profileDisplay, userData){
    //Player level
    profileDisplay.p_level.textContent += util.getPlayerLevel(userData.exp);
    //Player username
    profileDisplay.p_name.textContent = userData.username;
    //Player ID
    profileDisplay.p_id.textContent += userData.userId;
    //Player Birthday
    profileDisplay.p_birthday.textContent = userData.birthday;
    //Player Rank
    profileDisplay.p_rank_value = util.getPlayerRank(userData.rankPoints); 
    //Player Wins
    profileDisplay.p_wins_value = userData.totalWins;
    //Player Winrate
    let _winrate = (userData.totalWins / userData.totalMatches) * 100;
    profileDisplay.p_winrate_value = `${_winrate}%`;
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
