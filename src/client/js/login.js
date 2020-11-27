'use strict';
import * as util from './client_utilities.js';
import * as md5 from './md5.js';
import Validator from './Validator.js';

//Create elements
let [div_main, div_avatar, div_form] = util.createMultiDoms('div',
    {class: 'main container'},
    {class: 'avatar container'},
    {class: 'form container'},
);

let form_login = util.createDom('form', {class: 'login form'});
let img_avatar = util.createDom('img', {class: 'avatar img'});
let span_msg = util.createDom('span', {class: 'msg f15'});

let [lbl_usn, lbl_pwd] = util.createMultiDoms('label', 
    {class: 'usn_lable', txt: 'Username: '}, 
    {class: 'pwd_lable', txt: 'Password: '}
);

let [inp_usn, inp_pwd, inp_login] = util.createMultiDoms('input', 
    {class: 'txtbox usn', type: 'text', name: 'username', autocomplete: "off"}, 
    {class: 'txtbox pwd', type: 'password', name: 'password', autocomplete: "off"},
    {class: 'btn sbm', type: 'button', value: 'Login'}
);

let [a_signup, a_recover] = util.createMultiDoms('a',
    {class: 'signup link f12', txt: 'Sign Up', href: '../pages/signup.html'},
    {class: 'recover link f12', txt: 'Forgot username or password?', href: '#'}
);

//Build Page
util.addDom(form_login, span_msg, lbl_usn, inp_usn, lbl_pwd, inp_pwd, inp_login, a_recover, a_signup);
util.addDom(div_avatar, img_avatar);
util.addDom(div_form, form_login);
util.addDom(div_main, div_avatar, div_form);
util.addDom(document.body, div_main);

function validateLoginForm(){
    let validator = new Validator();
    let validations = [{
        strategy: 'isNonEmpty',
        errorMsg: 'Field can not be empty.'
    }];
    validator.add(inp_usn, validations);
    validator.add(inp_pwd, validations);
    return validator.start();
}

async function login(){
    let _errorMsg = validateLoginForm();
    if(_errorMsg){
        util.displayMsg(span_msg, _errorMsg, 'red');
        return; 
    }
        
    let _inputs = form_login.elements;
    let _data = {
        username: _inputs.username.value,
        password: md5.b64_md5(_inputs.password.value),
    }, _user = {};
    let _reqBody = util.generateReqBody('login', _user, _data);
    let _request = util.generatePOSTReq(_reqBody);
    let _res = await fetch('/login', _request);
    let _response = await _res.json();
    console.log(location.href);
    if(_response.status === 'SUCCESS'){
        let _user = _response.data;
        window.open(`http://${location.host}/pages/home.html`, '_self');
        console.log(_user);
    }else{
        util.displayMsg(span_msg, _response.data.message, 'red');
    }

}
inp_login.addEventListener('click', login);

window.onload = function() { 
    clearAllInputs();
    
};

function clearAllInputs(){
    document.querySelectorAll('.txtbox').forEach( elem => {elem.value = ''});
}
