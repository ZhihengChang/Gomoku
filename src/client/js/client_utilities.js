//Client Utilities
'use strict';

export {
    setAttrs, createDom, createMultiDoms, addDom, clearPage,
    createTableRow, getMatchInfo, clearAllRows,
    generateReqBody, generatePOSTReq, sendWSRequest,
    hideDom, showDom, showDomAsGrid, displayMsg,
    getPlayerLevel, getPlayerRank, isEmpty
};

// general ###################################################################

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
        more: (...others) => setAttrs(elem, ...others),
        // after: (fn) => fn.call(elem, arguments)
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

/**
 * Create 1 or multiple HTMLElement based on the (optional) number within attrs
 * or the number of attribute objects in attrs
 * @param {String} tagname 
 * @param  {[number], object} attrs 
 */
function createMultiDoms(tagname, ...attrs){
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
    if (!isEmpty(children)){
        for (let child of children) {
            if(child == null) continue;
            parent.appendChild(child);
        }
    }
    return parent;
}

function hideDom(elem){
    setAttrs(elem, {style: {display: 'none'}});
}

function showDom(elem){
    setAttrs(elem, {style: {display: 'block'}});
}

function showDomAsGrid(elem){
    setAttrs(elem, {style: {display: 'grid'}});
}

function displayMsg(elem, msg, color){
    setAttrs(elem, {
        txt: msg, 
        style: {color: color}
    });
}

/**
 * Clear all page content
 */
function clearPage(page) {
    let content = page.div_main;
    content.parentNode.removeChild(content);
}

// gtable ####################################################################

/**
 * 
 * @param {HTMLElement} table 
 * @param {object} game 
 */
function createTableRow(info, fn) {
    if(isEmpty(info)){
        return;
    }
    let _row = createDom('tr');
   
    for(let _key of Object.keys(info)){
        let _cell = createDom('td', {txt: info[_key], 'data-key': _key.toLowerCase()});
        if(fn){
            fn.call(this, _cell);
        }
        addDom(_row, _cell);
    }

    //add two btns
    return addDom(_row,
        addDom(createDom('td', { class: 'action' }), 
            createDom('button', { class: 'btn join', txt: 'Join' }),
            createDom('button', { class: 'btn spec', txt: 'Spectate' })
        )
    );
}

/**
 * get the corresponding table row for the botton (join/spec) 
 * @param {HTMLElement} btn 
 */
function getMatchInfo(btn){
    let _actionCell = btn.parentNode;
    let _row = _actionCell.parentNode;
    let _matchInfo = {};
    for(let _cell of _row.childNodes){
        _matchInfo[_cell.dataset.key] = _cell.textContent;
    }
    console.log(_matchInfo);
    return _matchInfo;
}

function clearAllRows(tablePart){
    while (tablePart.firstChild) {
        tablePart.removeChild(tablePart.firstChild);
    }
}

// communication ##############################################################

/**
 * returns a request body that contains 
 * action, user, current time, and request data
 * @param {string} action 
 * @param {object} user 
 * @param {object} data 
 */
function generateReqBody(action, user, data){
    return {
        action: action,
        user: user,
        timestamp: new Date(),
        data: data,
    }
}

/**
 * returns a POST request that contains
 * method, headers, and body
 * @param {object} reqBody 
 * @param {[string]} contentType 
 */
function generatePOSTReq(reqBody, contentType){
    if(!contentType) contentType = 'application/json';
    return {
        method: 'POST',
        headers: {'content-Type': contentType},
        body: JSON.stringify(reqBody),
    }
}

function sendWSRequest(socket, action, user, data){
    let _data = data || {};
    _data.timestamp = new Date();
    let _request = generateReqBody(action, user, _data);
    socket.send(JSON.stringify(_request));
}


// User #####################################################################

function getPlayerLevel(playerExp){
    return 1 + Math.floor(playerExp / 10);
}

function getPlayerRank(playerRankPoints){
    let rank = Math.floor(playerRankPoints / 100);
    switch(rank){
        case 0 : return 'BRONZE';
        case 1 : return 'SILVER';
        case 2 : return 'GOLD';
        case 3 : return 'PLATINUM';
        case 4 : return 'DIAMOND';
        case 5 : return 'MASTER';
        default: return 'SUPREME';
    }
}

function getPlayerWinrate(){
    return (this._user.totalWins / this._user.totalMatches) * 100;
}

// Other ####################################################################

function isEmpty(_obj) {
    if (Array.isArray(_obj) && _obj.length == 0) return true;
    if (_obj instanceof Set && _obj.size == 0) return true;
    if (_obj instanceof Map && _obj.size == 0) return true;

    return (!_obj || Object.keys(_obj).length == 0);
}
