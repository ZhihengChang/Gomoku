'use strict';
export {setAttrs, createDom, createMultiDom, addDom, isEmpty};
/**
 * Client Utilities
 */

/**
 * Set specific attribute(s) to the given DOM element
 * @param {HTMLElement} elem 
 * @param {object} attrs: an object contains 1 or multiple attributes
 */

function setAttrs(elem, ...attrs) {

    for (let _attr of attrs) {
        for (let _name in _attr) {
            switch (_name) {
                case 'class':
                    let classes = _attr.class;
                    elem.classList.add(...classes.split(' '));
                    break;
                case 'style':
                    let styles = _attr.style;
                    for (let styleName in styles) {
                        elem.style[styleName] = styles[styleName];
                    };
                    break;
                case 'txt':
                    elem.textContent = _attr.txt;
                    break;
                case 'hidden':
                    elem.hidden = _attr.hidden;
                    break;
                default:
                    elem.setAttribute(_name, _attr[_name]);
            }
        }
    }

    return {
        setAttrs: (...others) => setAttrs(elem, ...others)
    };
}

/**
 * Create a HTMLElement specified by the given tagname and returns it
 * @param {String} tagname 
 */
function createDom(tagname, ...attrs) {
    let newElem = document.createElement(tagname);
    if (attrs) {
        setAttrs(newElem, ...attrs);
    }
    return newElem;
}

//createMultiDom('p', 4, {1},{2})
function createMultiDom(tagname, ...attrs){
    if(isEmpty(attrs)){
        return [createDom(tagname)];
    }

    let domArr = [];
    let quantity = attrs.length;
    
    if(typeof attrs[0] === 'number'){
        quantity = attrs.shift();
    }
    let last = attrs.slice(-1)[0] || {};

    attrs.forEach(attr => {
        domArr.push(createDom(tagname, attr));
    });

    let rest = quantity - domArr.length;
    for(let i = 0; i < rest; i++){
        domArr.push(createDom(tagname, last));
    }

    return domArr;
}

/**
 * Append child/children element(s) to parent element
 * @param {HTMLElement} parent 
 * @param  {...HTMLElement} children 
 */
function addDom(parent, ...children) {
    if (!children) return;
    for (let child of children) {
        parent.appendChild(child);
    }
    return parent;
}

function isEmpty(_obj) {
    if (Array.isArray(_obj) && _obj.length == 0) return true;
    if (_obj instanceof Set && _obj.size == 0) return true;
    if (_obj instanceof Map && _obj.size == 0) return true;

    return (!_obj || Object.keys(_obj).length == 0);
}