// ==UserScript==
// @name         SG Grouppage Blocker
// @namespace    com.parallelbits
// @version      1.00
// @description  Remove games from group page you already have or you blocked
// @author       Daerphen
// @match        http://www.steamgifts.com/group/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var GAME_LIST_URL = 'http://www.steamgifts.com/account/steam/games/search';
var BLOCK_LIST_URL = 'http://www.steamgifts.com/account/settings/giveaways/filters';

function _hideGame(context, ga, reason, gamename) {
    var hit = 0;
    $(context).find('div.table__rows p.table__column__heading').each(function(i, value) {
        hit++;
    });
    if(hit > 0) {
        console.log(gamename + ' is removed because: "' + reason + '"');
        $(ga).hide();
    }
}

$('div.giveaway__row-outer-wrap').each(function(i,ga) {
	var storeURI = $(ga).find('a.giveaway__icon').attr('href');
	var gameName = $(ga).find('a.giveaway__heading__name').text();
    
    var url = GAME_LIST_URL + '?q=' + gameName;
    $.ajax(url, {
        async: true
    }).done(function(context) {
        _hideGame(context, ga, 'Already Exists on Account', gameName);
    });
    url = BLOCK_LIST_URL + '?q=' + gameName;
    $.ajax(url, {
        async: true
    }).done(function(context) {
        _hideGame(context, ga, 'Is on Ignorelist', gameName);
    });
});