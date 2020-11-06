'use strict';
import * as util from './client_utilities.js'

//Create elements
let [div, div_avatar, div_form, div_btn] = util.createMultiDom('div',
    {class: 'main container'},
    {class: 'avatar container'},
    {class: 'form container'},
    {class: 'submit container'}
);

let form_login = util.createDom('form', {class: 'login form'});
let img_avatar = util.createDom('img', {class: 'avatar img'});

let [lbl_usn, lbl_pwd] = util.createMultiDom('label', 
    {class: 'usn', txt: 'Username: '}, 
    {class: 'pwd', txt: 'Password: '}
);

let [inp_usn, inp_pwd] = util.createMultiDom('input', 
    {type: 'text', id: 'username'}, 
    {type: 'password', id: 'password'},
);

let [a_signup, a_recover] = util.createMultiDom('a',
    {class: 'signup link f12', txt: 'Sign Up', href: '#'},
    {class: 'recover link f12', txt: 'Forgot username or password?', href: '#'}
);

let btn_login = util.createDom('button', {class: 'login btn', txt: 'login'})

util.addDom(lbl_usn, inp_usn);
util.addDom(lbl_pwd, inp_pwd);

//Build Page
util.addDom(form_login, lbl_usn, lbl_pwd, a_recover, a_signup);
util.addDom(div_avatar, img_avatar);
util.addDom(div_form, form_login);
util.addDom(div_btn, btn_login);
util.addDom(div, div_avatar, div_form, div_btn);
util.addDom(document.body, div);

