// ==UserScript==
// @name         SG Remove Entries
// @namespace    https://www.parallel-bits.de
// @version      0.1
// @description  Look through all your entries and remove those for games you already own
// @author       Daerphen
// @match        https://www.steamgifts.com/account/steam/games
// @match        https://www.steamgifts.com/giveaways/entered
// @match        https://www.steamgifts.com/account/profile/sync
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    var storageKey = 'games_cache';
    initializeCache();
    var linkRegex = /http:\/\/store.steampowered.com\/app\/([0-9]+)\/?/g;
    var dispatcher = /https:\/\/www.steamgifts.com\/(account\/steam\/games|giveaways\/entered|account\/profile\/sync)/g;
    var dispatcherData = dispatcher.exec(location.href);
    if(dispatcherData[1] === 'account/steam/games') {
		var lastUpdate = '-';
		if(isCached('lastUpdate')) {
			lastUpdate = $.datepicker.formatDate("M d, yy", new Date(cache('lastUpdate')));
		}
        var button = $('<button>import (latest: '+lastUpdate+')</button>');
        button.click(function() {
			$('.page__heading').before('<div id="progress"></div>');
			$('#progress').progressbar({value: 0});
			var maxPages = parseInt($('.pagination__results strong').last().text().replace(/,/g, ''))/25;
            grabLoop($('body'), 0, maxPages);
        });
		$('head').append('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">');
        $('div.page__heading').append(button);
    } else if(dispatcherData[1] === 'account/profile/sync') {
    } else if(dispatcherData[1] === 'giveaways/entered') {
        var button = $('<button>check</button>');
		button.click(function() {
			var invalids = [];
			checkLoop($('body'), invalids);
		});
		$('div.page__heading').append(button);
    }
    function initializeCache() {
        if(localStorage.getItem(storageKey) === null) {
            localStorage.setItem(storageKey,JSON.stringify({}));
        }
    }
    function cache(key, val) {
        if(typeof val === 'undefined' || val === null) {
            return JSON.parse(localStorage.getItem(storageKey))[key];
        }
        var json = JSON.parse(localStorage.getItem(storageKey));
        json[key] = val;
        localStorage.setItem(storageKey, JSON.stringify(json));
    }
    function isCached(key) {
        if(localStorage.getItem(storageKey) !== null) {
            return typeof JSON.parse(localStorage.getItem(storageKey))[key] !== 'undefined';
        }
        return false;
    }
    function grabLoop(page, current, max) {
        var res = $(page).find('a.table__column__secondary-link');
        grabData(res);
		$('#progress').progressbar({value: current/max*100});
        var next = $(page).find('a.is-selected').next().attr('href');
		if(next !== 'undefined' && typeof next !== 'undefined') {
			var nextUrl = 'https://www.steamgifts.com' + next;
			$.ajax({
				url: nextUrl,
				success: function(context) {
					grabLoop(context, current+1, max);
				}
			});
		} else {
			cache('lastUpdate', new Date());
			$('#progress').remove();
		}
    }
    function grabData(res) {
        res.each(function(index, link){
            linkRegex.lastIndex = 0;
            var id = linkRegex.exec($(link).attr('href'))[1];
            cache(id, true);
        });
    }
	function checkLoop(page, invalids) {
		var res = $(page).find('.table__row-outer-wrap');
		var cont = checkData(res, invalids);
		var next = $(page).find('a.is-selected').next().attr('href');
		if(cont && next !== 'undefined' && typeof next !== 'undefined') {
			var nextUrl = 'https://www.steamgifts.com' + next;
			$.ajax({
				url: nextUrl,
				success: function(context) {
					checkLoop(context, invalids);
				}
			});
		}
	}
	function checkData(res, invalids) {
		res.each(function(index, row) {
			var date = $(row).find('span[data-timestamp]').attr('data-timestamp');
			var current = new Date().getTime()/1000;
			if(current > date) {
				// finished
				$('.table__rows').empty();
				invalids.forEach(function(v) {
					$('.table__rows').append(v);
				});
				return false;
			}
			var link = $(row).find('a.table__column__heading');
			var gaUrl = 'https://www.steamgifts.com' + $(link).attr('href');
			$.ajax({
				url: gaUrl,
				success: function(response) {
					checkGiveaway(response, row, invalids);
				}
			});
		});
		return true;
	}
	function checkGiveaway(context, row, invalids) {
		var appUrl = $(context).find('.global__image-outer-wrap--game-large').first().attr('href');
		linkRegex.lastIndex = 0;
		var id = linkRegex.exec(appUrl)[1];
        if(id !== 'undefined' && isCached(id)) {
			invalids.push(row);
		}
	}
})();