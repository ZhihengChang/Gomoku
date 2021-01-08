'use strict';
import * as util from './client_utilities.js';
/**
 * The createMenu is used to create different menu bar corresponding to different display.
 * The createMenu contains all functions used to create different menu.
 * Usage: createMenu.menuName();
 * The first property of each menu (object returned by createDisplay method) should always be div_menu.
 * All the createMenu methods return an object contains all node elements within the div (inclusive).
 */

var MENU_MAIN;
export const createMenu = {

    /**
     * Create the avatar menu
     * NOTE: Only used for login page
     */
    avatarMenu: createMenu_avatar,

    /**
     * Create the main menu
     * NOTE: This is the default menu when user logging in.
     */
    mainMenu: createMenu_main,

    /**
     * Create the ingame menu
     * Contains: "Surrender", "Undo", "Settings"
     */
    gameMenu: createMenu_game,
}

function createMenu_avatar() {
    let avatarMenu = {
        div_menu: util.createDom('div', { class: 'avatar container' }),
        img_avatar: util.createDom('img', { class: 'avatar img' }),
    }
    util.addDom(avatarMenu.div_menu, avatarMenu.img_avatar);
    return avatarMenu;
}

function createMenu_main() {
    if (!MENU_MAIN) {
        let mainMenu = {
            div_menu: util.createDom('div', { class: 'menu container' }),
            btn_home: util.createDom('button', { class: 'btn menubtn hm_button', txt: 'Home' }),
            btn_profile: util.createDom('button', { class: 'btn menubtn pf_button', txt: 'Profile' }),
            btn_friends: util.createDom('button', { class: 'btn menubtn fd_button', txt: 'Friends' }),
            btn_create: util.createDom('button', { class: 'btn menubtn ct_button', txt: 'Create' }),
            btn_settings: util.createDom('button', { class: 'btn menubtn st_button', txt: 'Setting' }),
        };
        util.addDom(mainMenu.div_menu,
            mainMenu.btn_home, mainMenu.btn_profile,
            mainMenu.btn_friends, mainMenu.btn_create,
            mainMenu.btn_settings
        );
        MENU_MAIN = mainMenu;
    }
    return MENU_MAIN;
}

function createMenu_game() {
    let gameMenu = {
        div_menu: util.createDom('div', { class: 'menu container' }),
        btn_undo: util.createDom('button', { class: 'btn menubtn undo_button', txt: 'Undo' }),
        btn_surrender: util.createDom('button', { class: 'btn menubtn sdr_button f11', txt: 'Surrender' }),
        // btn_settings: util.createDom('button', { class: 'btn menubtn st_button', txt: 'Setting' }),
    };
    util.addDom(gameMenu.div_menu, gameMenu.btn_undo, gameMenu.btn_surrender, gameMenu.btn_settings);
    return gameMenu;
}