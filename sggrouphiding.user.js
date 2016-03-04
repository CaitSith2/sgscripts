// ==UserScript==
// @name         SG Grouppage Blocker
// @namespace    com.parallelbits
// @version      1.04
// @description  Remove games from group page you already have or you blocked
// @author       Daerphen
// @match        http://www.steamgifts.com/group/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var GAME_LIST_URL = 'http://www.steamgifts.com/account/steam/games/search';
var BLOCK_LIST_URL = 'http://www.steamgifts.com/account/settings/giveaways/filters';

function _hideGame(context, ga, storeuri) {
    var hit = 0;
    $(context).find('div.table__rows p a.table__column__secondary-link').each(function(i, value) {
        if($(value).attr('href') === storeuri) {
            hit++;
        }
    });
    if(hit > 0) {
        $(ga).hide();
    }
}

$('div.giveaway__row-outer-wrap').each(function(i,ga) {
	var gameName = $(ga).find('a.giveaway__heading__name').text();
    var storeUri = $(ga).find('a.giveaway__icon').attr('href');
	if(gameName.endsWith('...')) {
		gameName = gameName.substring(0, gameName.length - 3);
	}
    
    var url = GAME_LIST_URL + '?q=' + gameName;
    $.ajax(url, {
        async: true
    }).done(function(context) {
        _hideGame(context, ga, storeUri);
    });
    url = BLOCK_LIST_URL + '?q=' + gameName;
    $.ajax(url, {
        async: true
    }).done(function(context) {
        _hideGame(context, ga, storeUri);
    });
});