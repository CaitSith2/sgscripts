// ==UserScript==
// @name        SG Augmented Gamelist
// @namespace   com.parallelbits
// @description Adds genre tags to game list
// @include     http://www.steamgifts.com/*
// @version     1.04
// @grant       none
// ==/UserScript==

var genre = [];
var PROXY_URL = 'http://proxy.parallel-bits.com/proxy';

function _addTags(uri, key) {
	var item = $('h2.giveaway__heading a[href="' + uri + '"]').parent();
	item.find('span.gametag').replaceWith('');
	let limit = 5;
	genre[key].forEach(function(value) {
		if(limit > 0) {
			limit--;
			item.append('<span class="gametag" style="margin-left: 10px; padding: 2px; color: gray; border: 1px solid rgba(0,0,0,.1); border-radius: 4px">' + value + '</span>');
		}
	});
}

$('a.giveaway__icon').each(function(i, value) {
	var link = $(this).attr("href");
	var reg = /(?:\/(app)\/([0-9]+)\/)|(?:(sub)\/([0-9]+)\/)/g;
	var data = reg.exec(link);
	if (data[1] === 'app') {
		var appURI = PROXY_URL + '?uri=app/' + data[2];
		$.ajax(appURI, {
			async: true
		}).done(function(context) {
			genre['app/' + data[2]] = context.tags;
			_addTags(value, 'app/' + data[2]);
		});
	} else if (data[3] === 'sub') {
		var subURI = PROXY_URL + '?uri=sub/' + data[4];
		$.ajax(subURI, {
			async: true
		}).done(function(context) {
			genre['sub/' + data[4]] = context.genres;
			_addTags(value, 'sub/' + data[4]);
		});
	}
});
