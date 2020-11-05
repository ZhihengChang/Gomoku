'use strict';
import * as util from './client_utilities.js'

//Create elements
let form = util.createDom('form');

let p_usn = util.createDom('p');
let label_usn = util.createDom('label', {txt: 'Username: '});
let input_usn = util.createDom('input', {type: 'text', id: 'username'});
p_usn = util.addDom(p_usn, label_usn, input_usn);

let p_pwd = util.createDom('p');
let label_pwd = util.createDom('label', {txt: 'Password: '});
let input_pwd = util.createDom('input', {type: 'password', id: 'password'});
p_pwd = util.addDom(p_pwd, label_pwd, input_pwd);

let input_login = util.createDom('input', {type: 'submit', value: 'Login'});
let btn_signup = util.createDom('button', {txt: 'Sign Up'});
let btn_forgot = util.createDom('button', {txt: 'Forgot username or password?'});

//Build Page
util.addDom(document.body, 
    util.addDom(form, p_usn, p_pwd, input_login),
    btn_signup, btn_forgot
);
