// ==UserScript==
// @name         SG Block Giveaway Button
// @namespace    com.parallelbits
// @version      1.04
// @description  Add a Button to Giveawaypage to block the game
// @author       Daerphen
// @match        http://www.steamgifts.com/giveaway/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var name = $('title').text();
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
        let sidebar = $('div[class="sidebar sidebar--wide"]');
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
    let data = JSON.parse(context);
    $(data.html).find('a.table__column__secondary-link').each(function(index, value) {
        if($(value).attr('href') === uri) {
            game_id = $(value).parent().parent().parent().parent().attr('data-autocomplete-id');
        }
    });
}

$.ajaxSetup({
  xhrFields: {
    withCredentials: true
  }
});

let popupURL = 'http://www.steamgifts.com';
$.ajax(popupURL, {
  async: true
}).done(function(context) {
    _setXSRF(context);
});

let gameFetchURL = 'http://www.steamgifts.com/ajax.php';
let searchData = {
    'do': 'autocomplete_game',
    'search_query': name.replace(/ /g, '+'),
    'page_number': 1
}
$.ajax(gameFetchURL, {
    async: true,
    method: 'post',
    data: searchData
}).done(function(context) {
    _setGameId(context);
});