// ==UserScript==
// @name         SG GroupIdentifier
// @namespace    com.parallelbits
// @version      1.10
// @description  Shows group list in front page
// @author       Daerphen
// @match        *://www.steamgifts.com/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

let limit = 8;

function _showGroups(context, item) {
	let hide = false;
    let Path = window.location.pathname;
    let names = [];
    $(context).find('a.table__column__heading').each(function(i, g) {
        names.push({"link": $(g).attr('href'), "name": htmlEncode($(g).text())});
		if(isCached(_getKeyFromURI($(g).attr('href')))) {
			console.log($(g).text());
			hide = true;
		}
    });
    let res = '';
	let i = 1;
    names.forEach(function(n) {
        res += '<a class="giveaway__column--group" href="' + n.link + '">' + n.name + '</a>';
		if(i%limit === 0) {
			$(item).append('<div class="giveaway__row-inner-wrap"><div class="giveaway__summary"><div class="giveaway__columns">'+res+'</div></div></div>');
            res = '';
		}
        i++;
    });
    $(item).append('<div class="giveaway__row-inner-wrap"><div class="giveaway__summary"><div class="giveaway__columns">'+res+'</div></div></div>');
    
	//When you are on your own user page, or on the specific group page, don't hide the giveaway.
    if(Path.match(/^\/user\//)) hide = false;
    if(Path.match(/^\/group\//)) hide = false;
    if(hide) {
    	$(item).hide();
    }
}

$('div.giveaway__row-outer-wrap').each(function(i, value) {
    let groupLink = $(value).find('a.giveaway__column--group');
    if(groupLink.attr("href")) {
        let baseURI = groupLink.attr("href");
        let groupURI = 'https://www.steamgifts.com' + baseURI;
        $.ajax(groupURI, {
            async: true
        }).done(function(context){
            _showGroups(context, value);
        });
    }
});

function _getKeyFromURI(uri) {
    let reg = /group\/([0-9a-zA-Z]+)\/.*/g;
    let data = reg.exec(uri);
    let key = data[1];
    return key;
}

initializeCache();

function initializeCache() {
    if(localStorage.getItem('group_cache') === null) {
        localStorage.setItem('group_cache',JSON.stringify({}));
    }
}

function cache(key, val) {
    if(typeof val === 'undefined' || val === null) {
        return JSON.parse(localStorage.getItem('group_cache'))[key];
    }
    let json = JSON.parse(localStorage.getItem('group_cache'));
    json[key] = val;
    localStorage.setItem('group_cache', JSON.stringify(json));
}

function isCached(key) {
    if(localStorage.getItem('group_cache') !== null) {
		let json = JSON.parse(localStorage.getItem('group_cache'));
        return json[key] !== null && typeof json[key] !== 'undefined';
    }
    return false;
}

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}
