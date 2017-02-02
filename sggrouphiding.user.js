// ==UserScript==
// @name         SG Grouppage Blocker
// @namespace    com.parallelbits
// @version      1.08
// @description  Remove games from group page you already have or you blocked
// @author       Daerphen
// @match        *://www.steamgifts.com/group/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var GAME_LIST_URL = 'https://www.steamgifts.com/account/steam/games/search';
var BLOCK_LIST_URL = 'https://www.steamgifts.com/account/settings/giveaways/filters';

initializeCache();

var groupIDPattern = /https:\/\/www.steamgifts.com\/group\/([0-9a-zA-Z]{5,5})\/.*/g
var groupID = groupIDPattern.exec(window.location.href)[1];
var group = null;

if(isCached(groupID)) {
	group = cache(groupID);
} else {
	group = {
		hideGiveaways: false
	};
	cache(groupID, group);
}

_hide(group);

var lastLink = $('.sidebar__navigation').last();
var buttonText = null!==group&&group.hideGiveaways?"unhide giveaways":"hide giveaways";
var toogleButton = $('<h3 class="sidebar__heading">Scripted Tools</h3><ul class="sidebar__navigation"><li class="sidebar__navigation__item"><a class="sidebar__navigation__item__link" style="cursor:pointer;"><div class="sidebar__navigation__item__name" id="hideButtonText"><i class="fa fa-eye-slash"></i> '+buttonText+'</div><div class="sidebar__navigation__item__underline"></div></a></li></ul>');
lastLink.after(toogleButton);
toogleButton.click(function(event) {
	group.hideGiveaways = !group.hideGiveaways;
	$('#hideButtonText').text(null!==group&&group.hideGiveaways?"unhide giveaways":"hide giveaways");
	cache(groupID, group);
	_hide(group);
})


function _hide(g) {
	if(null !== g) {
		if(g.hideGiveaways) {
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
		} else {
			$('div.giveaway__row-outer-wrap').each(function(i,ga) {
				console.log(ga);
				$(ga).show();
			});
		}
	} else {
		$('div.giveaway__row-outer-wrap').each(function(i,ga) {
			console.log(ga);
			$(ga).show();
		});
	}
}


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



function initializeCache() {
    if(localStorage.getItem('parallelbits.preference') === null) {
        localStorage.setItem('parallelbits.preference',JSON.stringify({}));
    }
}

function cache(key, val) {
    if(typeof val === 'undefined' || val === null) {
        return JSON.parse(localStorage.getItem('parallelbits.preference'))[key];
    }
    let json = JSON.parse(localStorage.getItem('parallelbits.preference'));
    json[key] = val;
    localStorage.setItem('parallelbits.preference', JSON.stringify(json));
}

function isCached(key) {
    if(localStorage.getItem('parallelbits.preference') !== null) {
        return typeof JSON.parse(localStorage.getItem('parallelbits.preference'))[key] !== 'undefined';
    }
    return false;
}