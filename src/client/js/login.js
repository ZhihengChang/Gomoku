'use strict';
import * as util from './client_utilities.js'

//Create elements
let [div_main, div_avatar, div_form] = util.createMultiDoms('div',
    {class: 'main container'},
    {class: 'avatar container'},
    {class: 'form container'},
);

let form_login = util.createDom('form', {class: 'login form'});
let img_avatar = util.createDom('img', {class: 'avatar img'});

let [lbl_usn, lbl_pwd] = util.createMultiDoms('label', 
    {class: 'usn_lable', txt: 'Username: '}, 
    {class: 'pwd_lable', txt: 'Password: '}
);

let [inp_usn, inp_pwd, inp_login] = util.createMultiDoms('input', 
    {class: 'txtbox usn', type: 'text', id: 'username'}, 
    {class: 'txtbox pwd', type: 'password', id: 'password'},
    {class: 'btn sbm', type: 'submit', value: 'Login'}
);

let [a_signup, a_recover] = util.createMultiDoms('a',
    {class: 'signup link f12', txt: 'Sign Up', href: '#'},
    {class: 'recover link f12', txt: 'Forgot username or password?', href: '#'}
);

//Build Page
util.addDom(form_login, lbl_usn, inp_usn, lbl_pwd, inp_pwd, inp_login, a_recover, a_signup);
util.addDom(div_avatar, img_avatar);
util.addDom(div_form, form_login);
util.addDom(div_main, div_avatar, div_form);
util.addDom(document.body, div_main);

