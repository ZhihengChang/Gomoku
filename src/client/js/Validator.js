'use strict'

export default class Validator {

    constructor(){
        this._cache = [];
    }

    add(dom, rules){
        for(let i = 0, rule; rule = rules[i++];){
            let _ruleArray = rule.strategy.split(':');
            let _errorMsg = rule.errorMsg;
            this._cache.push(function(){
                let _ruleFn = _ruleArray.shift();
                _ruleArray.unshift(dom.value);
                _ruleArray.push(_errorMsg);
                return strategies[_ruleFn].apply(dom, _ruleArray);
            });
        }
    }

    start(){
        for(let i = 0, fn; fn = this._cache[i++];){
            let errorMsg = fn();
            if(errorMsg){
                return errorMsg;
            }
        }
    }
}

const strategies = {
    isNonEmpty: function(value, errorMsg){
        if(value === ''){
            return errorMsg;
        }
    },

    contianLetter: function(value, errorMsg){
        let regExp = /[a-zA-Z]/g;
        if(!regExp.test(value)){
            return errorMsg;
        }
    },

    contianUppercase: function(value, errorMsg){
        if(value.toLowerCase() == value){
            return errorMsg;
        }
    },

    contianSpecialChar: function(value, errorMsg){
        let regExp = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;
        if(!regExp.test(value)){
            return errorMsg;
        }
    },

    noSpecialChar: function(value, errorMsg){
        if(!strategies.contianSpecialChar(value, errorMsg)){
            return errorMsg;
        }
    },

    contianDigit: function(value, errorMsg){
        let regExp = /\d/;
        if(!regExp.test(value)){
            return errorMsg;
        }
    },

    isValidEmail: function(value, errorMsg){
        let regExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!regExp.test(value)){
            return errorMsg;
        }
    },

    isValidBirthday: function(value, errorMsg){
        let regExp = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        if(!regExp.test(value)){
            return errorMsg;
        }
    },

    minLength: function(value, length, errorMsg){
        if(value.length < length){
            return errorMsg;
        }
    },

    isMatch: function(value, confirm, errorMsg){
        if(value != confirm){
            return errorMsg;
        }
    },
};