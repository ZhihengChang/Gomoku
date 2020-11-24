'use strict';
import * as util from './client_utilities.js';
import * as md5 from './md5.js';
import Validator from './Validator.js';

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
    {class: 'txtbox usn', type: 'text', name: 'username'}, 
    {class: 'txtbox eml', type: 'text', name: 'email'}, 
    {class: 'txtbox pwd', type: 'password', name: 'password'},
    {class: 'txtbox cfm', type: 'password', name: 'confirm'},
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

function validateSignUpForm(){
    let validator = new Validator();
    let usn_validations = [{
        strategy: 'isNonEmpty',
        errorMsg: 'Username can not be empty.'
    },{
        strategy: 'noSpecialChar',
        errorMsg: 'Username can not contain special characters.'
    }];

    let eml_validations = [{
        strategy: 'isNonEmpty',
        errorMsg: 'Email can not be empty.'
    },{
        strategy: 'isValidEmail',
        errorMsg: 'Email address is invalid.'
    }];

    let pwd_validations = [{
        strategy: 'minLength:8',
        errorMsg: 'Password must has a minium length of 8.'
    },{
        strategy: 'contianLetter',
        errorMsg: 'Password must contains at least one letter.'
    },{
        strategy: 'contianUppercase',
        errorMsg: 'Password must contains at least one uppercase letter.'
    },{
        strategy: 'contianSpecialChar',
        errorMsg: 'Password must contains at least one special character.'
    },{
        strategy: 'contianDigit',
        errorMsg: 'Password must contains at least one number from 0 to 9.'
    }];

    let cfm_validations = [{
        strategy: 'isMatch:' + inp_pwd.value,
        errorMsg: 'Passwords must be match.'
    }];

    validator.add(inp_usn, usn_validations);
    validator.add(inp_eml, eml_validations);
    validator.add(inp_pwd, pwd_validations);
    validator.add(inp_cfm, cfm_validations);
    return validator.start();
}

async function signup(){
    let errorMsg = validateSignUpForm();
    if(errorMsg){
        console.log(errorMsg);
        return;
    }
        
    let inputs = form_signup.elements;
    let data = {
        username: inputs.username.value,
        email: inputs.email.value,
        password: md5.b64_md5(inputs.password.value),
    }, user = {};
    let reqBody = util.generateReqBody('signup', user, data);
    let request = util.generatePOSTReq(reqBody);
    let response = await fetch('/signup', request);
    console.log(response);

}
inp_signup.addEventListener('click', signup);