'use strict';
import * as util from './client_utilities.js';
import {createPage} from './createPage.js';
var authToken;

let default_page = createPage.home();
let display = default_page.display;
let menu = default_page.menu;
util.addDom(document.body, default_page.div_main);


menu.btn_home.addEventListener('click', function(){
    let _home = createPage.home();
    document.body.innerHTML = '';
    util.addDom(document.body, _home.div_main);
});

menu.btn_profile.addEventListener('click', function(){
    document.body.innerHTML = '';
    let _profile = createPage.profile();
    let _user = JSON.parse(sessionStorage.user);
    // console.log(_user);
    //load user info
    // _profile.display.p_level.textContent += _user.exp;
    _profile.display.p_name.textContent = _user.username;
    _profile.display.p_id.textContent += _user.userId;
    _profile.display.p_birthday.textContent = _user.birthday;
    util.addDom(document.body, _profile.div_main);
});




document.addEventListener("DOMContentLoaded", () => {
    let _authToken = sessionStorage.getItem('authToken');
    console.log("auth token:" + _authToken);
    if (!_authToken) {
        document.body.innerHTML = ''
    }
});

window.addEventListener("unload", function () {
    delete sessionStorage.authToken;
    delete sessionStorage.user;
});

window.onload = () => {

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


/**
 * 
 * @param {HTMLElement} cell 
 */
function setTdColor(cell) {
    if (['undo', 'chat', 'status'].includes(cell.dataset.key)) {
        cell.classList.add(cell.textContent.replace(' ', '_').toLowerCase());
    }
}