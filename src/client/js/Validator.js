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
    }
};