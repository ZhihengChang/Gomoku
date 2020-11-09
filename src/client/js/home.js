'use strict';
import * as util from './client_utilities.js'

//Create elements
let [div_main, div_menu, div_gtable] = util.createMultiDoms('div',
    {class: 'main container'},
    {class: 'menu container'},
    {class: 'gtable container'},
);

let [btn_home, btn_profile, btn_friends, btn_create, btn_settings] = util.createMultiDoms('button',
    {class: 'btn menubtn hm_button', txt: 'Home'},
    {class: 'btn menubtn pf_button', txt: 'Profile'},
    {class: 'btn menubtn fd_button', txt: 'Friends'},
    {class: 'btn menubtn ct_button', txt: 'Create'},
    {class: 'btn menubtn st_button', txt: 'Setting'},
);

let tbl_gtable = util.createDom('table', {class: 'tbl gtable'});
let thd_gtable_head = util.createDom('thead', {class: 'thd'});
let tbd_gtable_body = util.createDom('tbody', {class: 'tbd'});
let tft_gtable_foot = util.createDom('tfoot', {class: 'tft'});

let [tr_head, tr_foot] = util.createMultiDoms('tr',
    {class: 'row head'},
    {class: 'row foot'}
);

let [th_id, th_level, th_status, th_undo, th_chat, th_size, th_spect, th_action] = util.createMultiDoms('th',
    {txt: 'Player ID'}, {txt: 'LV'}, {txt: 'Status'}, {txt: 'Undo'}, {txt: 'Chat'},
    {txt: 'Board Size'}, {txt: 'Spectating'}, {txt: ''}
);

//Test
// let game = {playerID: 'player1',playerLV: 10,status: 'Waiting',undo: 'OFF',chat: 'ON',boardSize: '19 X 19',spectating: 0};
// util.addDom(tbd_gtable_body, util.createTableRow(game, setTdColor));


//menu
util.addDom(div_menu, btn_home, btn_profile, btn_friends, btn_create, btn_settings);
//gtable
util.addDom(tr_head, th_id, th_level, th_status, th_undo, th_chat, th_size, th_spect, th_action);
util.addDom(thd_gtable_head, tr_head);
util.addDom(tft_gtable_foot, tr_foot);
util.addDom(tbl_gtable, thd_gtable_head, tbd_gtable_body, tft_gtable_foot);
util.addDom(div_gtable, tbl_gtable);
//main
util.addDom(div_main, div_menu, div_gtable);
util.addDom(document.body, div_main);

/**
 * 
 * @param {HTMLElement} cell 
 */
function setTdColor(cell){
    if(['undo', 'chat', 'status'].includes(cell.dataset.key)){
        cell.classList.add(cell.textContent.replace(' ','_').toLowerCase());
    }
}