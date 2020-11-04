/**
 * Client Utilities
 */

 /**
  * Set specific attribute(s) to the given DOM element
  * @param {HTMLElement} elem 
  * @param {object} attrs: an object contains 1 or multiple attributes
  */
function setDomAttrs(elem, attrs){
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
            case 'hidden':
                elem.hidden = attrs.hidden;
                break;
            default: 
                elem.setAttribute(attrName, attrs[attrName]);
        }
    }
}

/**
 * Create a HTMLElement specified by the given tagname and returns it
 * @param {String} tagname 
 */
function createDom(tagname){
    return document.createElement(tagname);
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