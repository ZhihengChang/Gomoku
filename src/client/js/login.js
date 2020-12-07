'use strict';
import * as md5 from './md5.js';
import Validator from './Validator.js';
import * as util from './client_utilities.js';
import {createPage} from './createPage.js';

let login_page = createPage.login();
let display = login_page.display;
let menu = login_page.menu;

util.addDom(document.body, login_page.div_main);

function validateLoginForm(){
    let validator = new Validator();
    let validations = [{
        strategy: 'isNonEmpty',
        errorMsg: 'Field can not be empty.'
    }];
    validator.add(display.inp_usn, validations);
    validator.add(display.inp_pwd, validations);
    return validator.start();
}

async function login(){
    let _errorMsg = validateLoginForm();
    if(_errorMsg){
        util.displayMsg(display.span_msg, _errorMsg, 'red');
        return; 
    }
        
    let _inputs = display.form_login.elements;
    let _data = {
        username: _inputs.username.value,
        password: md5.b64_md5(_inputs.password.value),
    }, _user = {};
    let _reqBody = util.generateReqBody('login', _user, _data);
    let _request = util.generatePOSTReq(_reqBody);
    let _res = await fetch('/login', _request);
    let _response = await _res.json();

    if(_response.status === 'SUCCESS'){
        _user = _response.data;
        sessionStorage.setItem('authToken', _user.authToken);
        sessionStorage.setItem('user', JSON.stringify(_user));
        let newWin = window.open(`${location.origin}/pages/home.html`, '_self');
        console.log(_user);
    }else{
        util.displayMsg(display.span_msg, _response.data.message, 'red');
    }
}
display.inp_login.addEventListener('click', login);

window.onload = function() { 
    clearAllInputs();
};

function clearAllInputs(){
    document.querySelectorAll('.txtbox').forEach( elem => {elem.value = ''});
}
