'use strict';
import * as util from './client_utilities.js'

//Create elements
let [div_main, div_form] = util.createMultiDoms('div',
    {class: 'main container'},
    {class: 'form container'},
);

let form_signup = util.createDom('form', {class: 'signup form'});
// let h3_formTitle = util.createDom('h3', {class: 'title f25', txt: 'Create Account'});

let [lbl_usn, lbl_eml, lbl_pwd, lbl_cfm] = util.createMultiDoms('label', 
    {class: 'usn_lable', txt: 'Username: '}, 
    {class: 'eml_lable', txt: 'Email: '}, 
    {class: 'pwd_lable', txt: 'Password: '},
    {class: 'cfm_lable', txt: 'Confirm: '}, 
);

let [inp_usn, inp_eml, inp_pwd, inp_cfm, inp_signup] = util.createMultiDoms('input', 
    {class: 'txtbox usn', type: 'text', id: 'username'}, 
    {class: 'txtbox eml', type: 'text', id: 'email'}, 
    {class: 'txtbox pwd', type: 'password', id: 'password'},
    {class: 'txtbox cfm', type: 'password', id: 'confirm'},
    {class: 'btn sbm', type: 'submit', value: 'Sign up'}
);

let a_signin = util.createDom('a', {class: 'signin link f12', txt: 'Sign in instead', href: '../pages/login.html'});

util.addDom(form_signup, 
    // h3_formTitle,
    lbl_usn, inp_usn, 
    lbl_eml, inp_eml, 
    lbl_pwd, inp_pwd,
    lbl_cfm, inp_cfm,
    a_signin, inp_signup
);
util.addDom(div_form, form_signup);
util.addDom(div_main, div_form);
util.addDom(document.body, div_main);