// ==UserScript==
// @name         SG Block Giveaway Button
// @namespace    com.parallelbits
// @version      1.01
// @description  Add a Button to Giveawaypage to block the game
// @author       Daerphen
// @match        http://www.steamgifts.com/giveaway/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var name = $('div.featured__heading__medium').text();
var uri = $('a.global__image-outer-wrap--game-large').attr('href');
var XSRF = null;
var popup = null;
var game_id = null;
var hide_button = null;

function _addButton() {
    if(XSRF !== null && hide_button === null) {
        hide_button = '<h3 class="sidebar__heading">Giveaway Filters</h3><ul class="sidebar__navigation">' + 
            '<li class="sidebar__navigation__item">' + 
            '<a id="hide-game" href="javascript:void(0)" class="sidebar__navigation__item__link"><div class="sidebar__navigation__item__name">Hide Game</div></a>' + 
            '</li></ul>';
        let sidebar = $('div.sidebar--wide');
        sidebar.append(hide_button);
        $('#hide-game').on('click', function() {
            let sink = 'http://www.steamgifts.com/';
            let data = {
                "xsrf_token": XSRF,
                "do": "hide_giveaways_by_game_id",
                "game_id": game_id
            };
            $.ajax(sink, {
                data: data,
                type: "POST"
            });
        });
    }
}

function _setXSRF(context) {
    popup = $(context);
    XSRF = popup.find('input[name="xsrf_token"]').attr('value');
    _addButton();
}

function _setGameId(context) {
    $(context).find('div.giveaway__summary a.giveaway__icon').each(function(index, value) {
        if($(value).attr('href') === uri) {
            game_id = $(value).parent().find('i.giveaway__hide').attr('data-game-id');
        }
    });
}

var popupURL = 'http://www.steamgifts.com';
$.ajax(popupURL, {
  async: true
}).done(function(context) {
    _setXSRF(context);
});

var gameFetchURL = 'http://www.steamgifts.com/giveaways/search?q=' + name.replace(/ /g, '+');
$.ajax(gameFetchURL, {
    async: true
}).done(function(context) {
    _setGameId(context);
});