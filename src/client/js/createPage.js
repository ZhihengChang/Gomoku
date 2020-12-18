'use strict';
import * as util from './client_utilities.js';
import {createDisplay} from './createDisplay.js';
import {createMenu} from './createMenu.js';

export const createPage = {
    
    login: () => buildPage(createMenu.avatarMenu(), createDisplay.login()),
    signup: () => buildPage(null, createDisplay.signup()),
    home: () => buildPage(createMenu.mainMenu(), createDisplay.gameTable()),
    profile: () => buildPage(createMenu.mainMenu(), createDisplay.profile()),
    newGame: () => buildPage(createMenu.mainMenu(), createDisplay.newGame()),
    inGame: () => buildPage(createMenu.gameMenu(), createDisplay.inGame()),
}

function buildPage(menu, display){
    let div_main = util.createDom('div', {class: 'main container'});
    let div_menu = menu ? menu.div_menu: null;
    let div_display = display ? display.div_display: null;

    let page = {
        div_main: util.addDom(div_main, div_menu, div_display),
        menu: menu,
        display: display,
    }
    return page;
}