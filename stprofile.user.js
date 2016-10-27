// ==UserScript==
// @name         SteamTrade Profile Button
// @namespace    http://www.parallel-bits.de
// @version      0.1
// @description  Adds a button to SG Profiles to link to their SteamTrade Profile
// @author       Daerphen
// @match        *://www.steamgifts.com/user/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var buttonList = $('div.sidebar__shortcut-inner-wrap');
    var steamButton = buttonList.children().last();
    var tradeButton = steamButton.clone();
    tradeButton.html('<i class="fa fa-fw"><img src="https://cdn.steamtrades.com/img/favicon.ico"/></i>');
    var href = tradeButton.attr('href');
    var regex = /http:\/\/steamcommunity.com\/profiles\/([0-9]+)/g;
    var data = regex.exec(href);
    var stHref = data[1];
    tradeButton.attr('href', 'https://www.steamtrades.com/user/' + stHref);
    buttonList.append(tradeButton);
})();