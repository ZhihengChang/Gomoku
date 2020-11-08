'use strict';
import * as util from './client_utilities.js'

//Create elements
let [div_main, div_menu, div_gtable] = util.createMultiDoms('div',
    {class: 'main container'},
    {class: 'menu container'},
    {class: 'gtable container'},
);

let [btn_profile, btn_friends, btn_create, btn_settings] = util.createMultiDoms('button',
    {class: 'btn menubtn pf_button', txt: 'Profile'},
    {class: 'btn menubtn fd_button', txt: 'Friends'},
    {class: 'btn menubtn ct_button', txt: 'Create'},
    {class: 'btn menubtn st_button', txt: 'Setting'},
);

util.addDom(div_menu, btn_profile, btn_friends, btn_create, btn_settings);
util.addDom(div_main, div_menu, div_gtable);
util.addDom(document.body, div_main);