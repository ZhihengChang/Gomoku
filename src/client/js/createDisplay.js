'use strict';
import * as util from './client_utilities.js';
/**
 * The createDisplay is used to create different display (right side div in the main div) of Home page.
 * The createDisplay contains all functions used to create different display.
 * Usage: createDisplay.displayName();
 * The first property of each display (object returned by createDisplay method) should always be div_display.
 * All the createDisplay methods return an object contains all node elements within the div (inclusive).
 */
export const createDisplay = {

    /**
     * Create the Login Form display.
     * NOTE: This display alows user to login
     */
    login: createDisplay_login,

    /**
     * Create the sign up Form display.
     * NOTE: This display alows user to sign up
     */
    signup: createDisplay_signup,

    /**
     * Create the Game Table display.
     * When "Home" button pressed, Game Table is displayed.
     * NOTE: This is the default display when user logging in, shows game list.
     */
    gameTable: createDisplay_gameTable,

    /**
     * Create the Profile display.
     * When "Profile" button pressed, Profile is displayed.
     * NOTE: This display shows player info.
     */
    profile: createDisplay_profile,

    /**
     * Create the Friends display.
     * When "Friends" button pressed, Friends is displayed.
     * NOTE: This display shows player friends list.
     */
    friends: createDisplay_friends,

    /**
     * Create the New Game display.
     * When "Create" button pressed, New Game is displayed.
     * NOTE: This display shows new game options.
     */
    newGame: createDisplay_newGame,

    /**
     * Create the Settings display.
     * When "Settings" button pressed, Settings is displayed.
     * NOTE: This display shows the program settings.
     */
    settings: createDisplay_settings,

    /**
     * Create the In Game display.
     * When create a new game/enter a game, In Game is displayed.
     * NOTE: This display shows the game board and chat window.
     */
    game: createDisplay_game,
}

function createDisplay_login() {
    let login = {
        div_display: util.createDom('div', { class: 'form container' }),
        form_login: util.createDom('form', { class: 'login form' }),
        span_msg: util.createDom('span', { class: 'msg f15' }),
        //lable
        lbl_usn: util.createDom('label', { class: 'usn_lable', txt: 'Username: ' }),
        lbl_pwd: util.createDom('label', { class: 'pwd_lable', txt: 'Password: ' }),
        //textbox
        inp_usn: util.createDom('input', { class: 'txtbox usn', type: 'text', name: 'username', autocomplete: "off" },),
        inp_pwd: util.createDom('input', { class: 'txtbox pwd', type: 'password', name: 'password', autocomplete: "off" },),
        inp_login: util.createDom('input', { class: 'btn sbm', type: 'button', value: 'Login' }),
        //links
        a_signup: util.createDom('a', { class: 'signup link f12', txt: 'Sign Up', href: '../pages/signup.html' }),
        a_recover: util.createDom('a', { class: 'recover link f12', txt: 'Forgot username or password?', href: '#' }),
    }
    util.addDom(login.form_login,
        login.span_msg,
        login.lbl_usn, login.inp_usn,
        login.lbl_pwd, login.inp_pwd,
        login.inp_login,
        login.a_recover, login.a_signup
    );
    util.addDom(login.div_display, login.form_login);
    return login;
}

function createDisplay_signup() {
    let signup = {
        div_display: util.createDom('div', { class: 'form container' }),
        form_signup: util.createDom('form', { class: 'signup form' }),
        span_msg: util.createDom('span', { class: 'msg f13' }),
        //label
        lbl_usn: util.createDom('label', { class: 'usn_lable', txt: 'Username: ' }), 
        lbl_eml: util.createDom('label', { class: 'eml_lable', txt: 'Email: ' }), 
        lbl_bhd: util.createDom('label', { class: 'bhd_lable', txt: 'Birthday: ' }), 
        lbl_pwd: util.createDom('label', { class: 'pwd_lable', txt: 'Password: ' }), 
        lbl_cfm: util.createDom('label', { class: 'cfm_lable', txt: 'Confirm: ' }),
        //textbox
        inp_usn: util.createDom('input', { class: 'txtbox usn', type: 'text', name: 'username' }), 
        inp_eml: util.createDom('input', { class: 'txtbox eml', type: 'text', name: 'email' }), 
        inp_bhd: util.createDom('input', { class: 'txtbox bhd', type: 'text', name: 'birthday', placeholder: 'MM/DD/YYYY' }), 
        inp_pwd: util.createDom('input', { class: 'txtbox pwd', type: 'password', name: 'password' }), 
        inp_cfm: util.createDom('input', { class: 'txtbox cfm', type: 'password', name: 'confirm' }), 
        inp_signup: util.createDom('input', { class: 'btn sbm', type: 'submit', value: 'Sign up' }), 
        //link
        a_signin: util.createDom('a', { class: 'signin link f12', txt: 'Sign in instead', href: '../pages/login.html' }),
    }
    util.addDom(signup.form_signup, 
        signup.lbl_usn, signup.inp_usn, 
        signup.lbl_eml, signup.inp_eml, 
        signup.lbl_bhd, signup.inp_bhd,
        signup.lbl_pwd, signup.inp_pwd,
        signup.lbl_cfm, signup.inp_cfm,
        signup.span_msg, signup.a_signin, 
        signup.inp_signup
    );
    util.addDom(signup.div_display, signup.form_signup);
    return signup;
}


function createDisplay_gameTable() {
    let gameTable = {
        div_display: util.createDom('div', { class: 'gtable container' }),
        tbl_gtable: util.createDom('table', { class: 'tbl gtable' }),
        //Table structure
        thd_gtable_head: util.createDom('thead', { class: 'thd' }),
        tbd_gtable_body: util.createDom('tbody', { class: 'tbd' }),
        tft_gtable_foot: util.createDom('tfoot', { class: 'tft' }),
        //Table rows
        tr_head: util.createDom('tr', { class: 'row head' }),
        tr_foot: util.createDom('tr', { class: 'row foot' }),
        //Table colums
        th_id: util.createDom('th', { txt: 'Player' }),
        th_level: util.createDom('th', { txt: 'LV' }),
        th_status: util.createDom('th', { txt: 'Status' }),
        th_undo: util.createDom('th', { txt: 'Undo' }),
        th_chat: util.createDom('th', { txt: 'Chat' }),
        th_size: util.createDom('th', { txt: 'Board Size' }),
        th_spect: util.createDom('th', { txt: 'Spectating' }),
        th_action: util.createDom('th', { txt: '' })
    }
    util.addDom(gameTable.tr_head,
        gameTable.th_id, gameTable.th_level, gameTable.th_status,
        gameTable.th_undo, gameTable.th_chat, gameTable.th_size,
        gameTable.th_spect, gameTable.th_action,
    );
    util.addDom(gameTable.thd_gtable_head, gameTable.tr_head);
    util.addDom(gameTable.tft_gtable_foot, gameTable.tr_foot);
    util.addDom(gameTable.tbl_gtable,
        gameTable.thd_gtable_head,
        gameTable.tbd_gtable_body,
        gameTable.tft_gtable_foot
    );
    util.addDom(gameTable.div_display, gameTable.tbl_gtable);
    return gameTable;
}

function createDisplay_profile() {
    let profile = {
        div_display: util.createDom('div', { class: 'profile container' }),
        div_left: util.createDom('div', { class: 'left container' }),
        div_info: util.createDom('div', { class: 'player_info container' }),

        div_right: util.createDom('div', { class: 'right container' }),
        div_stat: util.createDom('div', { class: 'player_stat container' }),
        div_hist: util.createDom('div', { class: 'hist container' }),

        //left info
        img_avatar: util.createDom('img', {class: 'avatar img'}),
        p_level: util.createDom('p', { class: 'info f16', txt: 'LV ' }),
        p_name: util.createDom('p', { class: 'info f20', txt: 'username' }),
        p_id: util.createDom('p', { class: 'info f16', txt: 'ID: ' }),
        p_birthday: util.createDom('p', { class: 'info f16', txt: 'Jan 1st 2020'}),
        txtarea_signature: util.createDom('textarea', { 
            class: 'txtarea signature info', 
            placeholder: 'click to edit signature...',
            spellcheck: false,
        }),

        //right stat
        p_rank_value: util.createDom('p', { class: 'statValue f50', txt: 'BRONZE'}),
        p_rank: util.createDom('p', { class: 'stat f25', txt: 'RANK'}),
        p_wins_value: util.createDom('p', { class: 'statValue f50', txt: '0'}),
        p_wins: util.createDom('p', { class: 'stat f25', txt: 'WINS'}),
        p_winrate_value: util.createDom('p', { class: 'statValue f50', txt: '0%'}),
        p_winrate: util.createDom('p', { class: 'stat f25', txt: 'WIN RATE'}),
    }
    util.addDom(profile.div_info,
        profile.p_level, profile.p_name, profile.p_id, 
        profile.p_birthday, profile.txtarea_signature,
    );
    util.addDom(profile.div_stat, 
        profile.p_rank_value, profile.p_rank,
        profile.p_wins_value, profile.p_wins,
        profile.p_winrate_value, profile.p_winrate,
    );
    util.addDom(profile.div_left, profile.img_avatar, profile.div_info);
    util.addDom(profile.div_right, profile.div_stat, profile.div_hist);
    util.addDom(profile.div_display, profile.div_left, profile.div_right);
    return profile;
}

function createDisplay_friends() {

}

function createDisplay_newGame() {

}

function createDisplay_settings() {

}

function createDisplay_game() {

}