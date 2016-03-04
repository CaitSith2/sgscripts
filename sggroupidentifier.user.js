// ==UserScript==
// @name         SG GroupIdentifier
// @namespace    com.parallelbits
// @version      1.01
// @description  Shows group list in front page
// @author       Daerphen
// @match        http://www.steamgifts.com/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

let limit = 10;

function _showGroups(context, item) {
    let names = [];
    $(context).find('a.table__column__heading').each(function(i, g) {
        names.push({"link": $(g).attr('href'), "name": $(g).text()});
    });
    let res = '';
	let i = 0;
    names.forEach(function(n) {
		if(i < limit) {
			res += '<a class="giveaway__column--group" href="' + n.link + '">' + n.name + '</a>';
		}
        i++;
    });
    $(item).append('<div class="giveaway__columns">'+res+'</div>');
}

$('div.giveaway__row-outer-wrap').each(function(i, value) {
    let groupLink = $(value).find('a.giveaway__column--group');
    if(groupLink.attr("href")) {
        let baseURI = groupLink.attr("href");
        let groupURI = 'http://www.steamgifts.com' + baseURI;
        $.ajax(groupURI, {
            async: true
        }).done(function(context){
            _showGroups(context, value);
        });
    }
});