// ==UserScript==
// @name         SG Grouppage Blocker
// @namespace    com.parallelbits
// @version      0.01
// @description  Remove games from group page you already have or you blocked
// @author       Daerphen
// @match        http://www.steamgifts.com/group/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

$('div.giveaway__row-outer-wrap').each(function(ga) {
	var storeURI = ga.find('a.giveaway__icon').attr('href');
	var gameName = ga.find('a.giveaway__heading__name').val();
	console.log(gameName);
});
