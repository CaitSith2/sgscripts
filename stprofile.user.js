// ==UserScript==
// @name         SteamTrade Profile Button
// @namespace    http://www.parallel-bits.de
// @version      0.3
// @description  Adds a button to SG Profiles to link to their SteamTrade Profile
// @author       Daerphen
// @match        *://www.steamgifts.com/user/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	var dispatcherRegex = /(http|https):\/\/www.(steamgifts|steamtrades).com\/user\/([0-9a-zA-Z]+)/g;
	var dispatcher = dispatcherRegex.exec(location.href);
	if(dispatcher[2] === 'steamgifts') {
    	var buttonList = $('div.sidebar__shortcut-inner-wrap');
    	var steamButton = buttonList.children('a[href*="steamcommunity.com"]');
    	var tradeButton = steamButton.clone();
    	tradeButton.html('<i class="fa fa-fw"><img src="https://cdn.steamtrades.com/img/favicon.ico"/></i>');
    	var href = tradeButton.attr('href');
    	var regex = /http:\/\/steamcommunity.com\/profiles\/([0-9]+)/g;
    	var data = regex.exec(href);
    	var stHref = data[1];
    	tradeButton.attr('href', 'https://www.steamtrades.com/user/' + stHref);
    	buttonList.append(tradeButton);
	} else if(dispatcher[2] === 'steamtrades') {
		$('div.profile_links').append('<a class="btn_action white" rel="nofollow" target="_blank" href="https://www.steamgifts.com/go/user/'+dispatcher[3]+'"><i class="fa fa-fw"><img src="https://cdn.steamgifts.com/img/favicon.ico"/></i><span>Visit SteamGifts Profile</span></a>');
	}
})();
