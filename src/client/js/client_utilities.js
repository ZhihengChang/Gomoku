'use strict';
/**
 * Client Utilities
 */

 /**
  * Set specific attribute(s) to the given DOM element
  * @param {HTMLElement} elem 
  * @param {object} attrs: an object contains 1 or multiple attributes
  */

function setDomAttrs(elem, attrs, ...moreAttrs){

    if(!isEmpty(moreAttrs)){
        setDomAttrs(elem, ...moreAttrs);
    }

    for(let attrName in attrs){
        switch(attrName){
            case 'class':
                let classes = attrs.class;
                elem.classList.add(...classes.split(' '));
                break;
            case 'style':
                let styles = attrs.style;
                for(let styleName in styles){
                    elem.style[styleName] = styles[styleName];
                };
                break;
            case 'txt':
                elem.textContent = attrs.txt;
                break;
            case 'hidden':
                elem.hidden = attrs.hidden;
                break;
            default: 
                elem.setAttribute(attrName, attrs[attrName]);
        }
    }

    return elem;
}

setDomAttrs.prototype.addAttr = function(attrs){
    setDomAttrs(this, attrs);
}

/**
 * Create a HTMLElement specified by the given tagname and returns it
 * @param {String} tagname 
 */
function createDom(tagname, attrs){
    let newElem = document.createElement(tagname);
    if(attrs){
        setDomAttrs(newElem, attrs);
    } 
    return newElem;
}

/**
 * Append child/children element(s) to parent element
 * @param {HTMLElement} parent 
 * @param  {...HTMLElement} children 
 */
function addDom(parent, ...children){
    if(!children) return;
    for(let child of children){
        parent.appendChild(child);
    }
    return parent;
}

function isEmpty(_obj) {
    if( Array.isArray(_obj) && _obj.length == 0) return true;
    if( _obj instanceof Set && _obj.size == 0) return true;
    if( _obj instanceof Map && _obj.size == 0) return true;

    return (!_obj || Object.keys(_obj).length == 0);
}