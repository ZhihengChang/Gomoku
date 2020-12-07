'use strict';
import * as md5 from './md5.js';
import Validator from './Validator.js';
import * as util from './client_utilities.js';
import {createPage} from './createPage.js';

let signup_page = createPage.signup();
let display = signup_page.display;
util.addDom(document.body, signup_page.div_main);

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

    let bhd_validations = [{
        strategy: 'isValidBirthday',
        errorMsg: 'Birthday date is invalid.'
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
        strategy: `isMatch:${display.inp_pwd.value}`,
        errorMsg: 'Passwords must be match.'
    }];

    validator.add(display.inp_usn, usn_validations);
    validator.add(display.inp_eml, eml_validations);
    validator.add(display.inp_bhd, bhd_validations);
    validator.add(display.inp_pwd, pwd_validations);
    validator.add(display.inp_cfm, cfm_validations);
    return validator.start();
}

async function signup(){
    let _action = 'signup';
    let _errorMsg = validateSignUpForm();
    if(_errorMsg){
        util.displayMsg(display.span_msg, _errorMsg, 'red');
        return;
    }
        
    let _inputs = display.form_signup.elements;
    let _data = {
        username: _inputs.username.value,
        email: _inputs.email.value,
        birthday: _inputs.birthday.value,
        password: md5.b64_md5(_inputs.password.value),
    }, _user = {};

    let _reqBody = util.generateReqBody(_action, _user, _data);
    let _request = util.generatePOSTReq(_reqBody);
    let _res = await fetch(`/${_action}`, _request);
    let _response = await _res.json();
    
    console.log(_response);
    if(_response.event != _action){
        return;
    }

    let _msg = _response.data.message;
    if(_response.status === 'SUCCESS'){
        util.displayMsg(display.span_msg, _msg, 'green');
        setTimeout(() => display.a_signin.click(), 500);
        return;
    }
    util.displayMsg(display.span_msg, _msg, 'red');
}

display.inp_signup.addEventListener('click', signup);