// ==UserScript==
// @name         SG Block Giveaway Button
// @namespace    com.parallelbits
// @version      1.13
// @description  Add a Button to Giveawaypage to block the game
// @author       Daerphen
// @match        *://www.steamgifts.com/giveaway/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var game_name = $('title').text();
var uri = $('a.global__image-outer-wrap--game-large').attr('href');
var XSRF = null;
var popup = null;
var game_id = null;
var hide_button = null;
var status = false;
var enter_button_text = null;

function _addButton() {
    var sidebar = $('div[class="sidebar sidebar--wide"]');
    _updateButton();
}

function _updateButton() {
    var buttonText = enter_button_text;
    
    
    if(status) {
       buttonText = buttonText.replace(/Enter Giveaway/g, 'Giveaway blocked');
       var enterButton = $('div.sidebar__entry-insert');
       if(enterButton.length) {
            enterButton.addClass('sidebar__error');
            enterButton.html(buttonText);
       }
    } else {
        var enterButton = $('div.sidebar__error');
        if(enterButton.length && enterButton.hasClass('sidebar__entry-insert')) {
            enterButton.removeClass('sidebar__error');
            enterButton.html(buttonText);
        }
    }
}

function _setStatus(context) {
    var hit = 0;
    $(context).find('div.table__rows p a.table__column__secondary-link').each(function(i, value) {
        if($(value).attr('href') === uri) {
            hit++;
        }
    });
    if(hit > 0) {
        status = true;
    } else {
        status = false;
    }
    
    enter_button_text = $('div.sidebar__entry-insert').html();
}

$.ajaxSetup({
  xhrFields: {
    withCredentials: true
  }
});

var statusURL = 'https://www.steamgifts.com/account/settings/giveaways/filters/search?q=' + game_name.replace(/ /g, '+');
$.ajax(statusURL).done(function(context) {
    _setStatus(context);
    _updateButton();
});
        
        