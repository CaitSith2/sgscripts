// ==UserScript==
// @name         SG Exclude Group
// @namespace    com.parallelbits
// @version      1.00
// @description  Exclude groups from showing the giveaways
// @author       Daerphen
// @match        *://www.steamgifts.com/account/steam/groups
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';


$('div.table__row-outer-wrap').each(function(i, value) {
	let link = '';
	let group = _getKeyFromURI($(value).find('a.table__column__heading').attr('href'));
	if(isCached(group)) {
		link = $('<div><i class="hide-group fa fa-eye-slash" data-groupid="'+group+'"></i> <span class="label-hide">unhide</span></div>');
	} else {
		link = $('<div><i class="hide-group fa fa-eye-slash" data-groupid="'+group+'"></i> <span class="label-hide">hide</span></div>');
	}
	link.bind('click', function() {
		let groupid = $(this).find('i').data('groupid');
		if(isCached(groupid)) {
			uncache(groupid);
			$(this).find('.label-hide').replaceWith('<span class="label-hide">hide</span>');
		} else {
			cache(groupid, groupid);
			$(this).find('.label-hide').replaceWith('<span class="label-hide">unhide</span>');
		}
		console.log($(this).find('i').data('groupid'));
	});
	$(value).find('div.table__row-inner-wrap').append(link);
	
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

function uncache(key) {
	let json = JSON.parse(localStorage.getItem('group_cache'));
	json[key] = null;
	localStorage.setItem('group_cache', JSON.stringify(json));
}

function isCached(key) {
    if(localStorage.getItem('group_cache') !== null) {
		let json = JSON.parse(localStorage.getItem('group_cache'));
        return json[key] !== null && typeof json[key] !== 'undefined';
    }
    return false;
}