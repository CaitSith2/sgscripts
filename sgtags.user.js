// ==UserScript==
// @name        SG Augmented Gamelist
// @namespace   com.parallelbits
// @description Adds genre tags to game list
// @match     *://www.steamgifts.com/*
// @version     1.23
// @grant       none
// ==/UserScript==
'use strict';

var PROXY_URL = 'https://proxy-parallelbits.rhcloud.com/proxy';
let popup = $('<div class="gameinfo">');
$('body').append(popup);


_addStyle('div.gameinfo{background-color:#1b2838;display:none;padding:10px;border-radius:5px;opacity:1;z-index:100;}');
_addStyle('span.gametag{margin-left:10px;padding:2px;color:#67c1f5;background-color:rgba( 103, 193, 245, 0.2 );border:1px solid rgba(0,0,0,.1);border-radius:4px}');
_addStyle('span.rating{margin-left:10px;padding:2px;color:#67c1f5;}');
_addStyle('span.label{color:#67c1f5;width:60px;display:inline-block;}');
_addStyle('.infotext{text-shadow:none;line-height:25px}');

$('.widget-container:nth-child(1) a.giveaway__icon').each(function(index, storeLink) {
    let storeUri = $(storeLink).attr('href');
    $(storeLink).parent().mouseenter(function(e) {
        _showGameinfo(storeUri, $(storeLink));
    });
    $(storeLink).parent().mouseleave(function(e) {
        popup.hide();
    });
    _gatherGameinfo(storeUri);
});

$('.featured__inner-wrap').each(function(index, ga) {
    let storeUri = $(ga).find('a.global__image-outer-wrap--game-large').attr('href');
    if(typeof storeUri !== 'undefined') {
        _gatherGameinfo(storeUri, _showFeaturedInfo);
    }
});

function _showFeaturedInfo(key) {
    $('.featured__inner-wrap .featured__summary').each(function(index, ga) {
        let info = $('<div>');
        _createContent(info, key, 10);
        $(this).append(info);
    });
}

function _positionAtElement(popup, element) {
    let pos = element.position();
    let width = element.outerWidth();
    let height = element.outerHeight();
    popup.css({
        position: "absolute",
        top: (pos.top + height + 10) + "px",
        left: (pos.left + width + 10) + "px"
    });
}

function _addStyle(s) {
    let style = $('style.infostyle');
    if(style.length) {
        style.append(s);
    } else {
        style = '<style class="infostyle">' + s + '</style>';
        $('head').append(style);
    }
}

function _gatherGameinfo(uri, callback) {
    let key = _getKeyFromURI(uri);
    if(!isCached(key)) {
        var ajaxURI = PROXY_URL + '?uri=' + key;
        $.ajax(ajaxURI, {
            async: true
        }).done(function(context) {
            cache(key, context);
            if(typeof callback !== 'undefined') {
                callback(key);
            }
        });
    } else if(typeof callback !== 'undefined') {
        callback(key);
    }
}

function _showGameinfo(uri, loc) {
    _openDialog(loc, _getKeyFromURI(uri));
}

function _getKeyFromURI(uri) {
    let reg = /(app|sub)\/(\d+)/g;
    let data = reg.exec(uri);
    let key = data[1] + '/' + data[2];
    return key;
}

function _openDialog(loc, key) {
    popup.empty();
    _createContent(popup, key, 5);
    _positionAtElement(popup, loc);
    popup.show();
}

function _createContent(block, key, limit) {
    block.append('<span class="label infotext">User Tags:</span>');
    let data = cache(key);
    if(data !== null) {
		console.log(data);
        if(data.tags) {
            data.tags.forEach(function(value, index) {
                if(index < limit) {
                    block.append('<span class="gametag infotext">' + value + '</span>');
                }
            });
        }
        
        block.append('<br/><span class="label infotext">Features:</span>');
        if(data.features) {
            data.features.forEach(function(value) {
                block.append('<span class="gametag infotext"><img width="20" src="' + value + '"</></span>');
            });
        }
        
        limit = 5;
        block.append('<br/><span class="label infotext">Genres:</span>');
        if(data.genres) {
            data.genres.forEach(function(value, index) {
                if(index < limit) {
                    block.append('<span class="gametag infotext">' + value + '</span>');
                }
            });
        }
        
        if(data.metacritic !== null && typeof data.metacritic !== 'undefined') {
            block.append('<br/><span class="label infotext">Metacritic:</span>');
            block.append('<span class="rating infotext">' + data.metacritic + '</span>');
        }
		
		if(data.rating_recent !== null && typeof data.rating_recent !== 'undefined') {
			
			block.append('<br/><span class="label infotext">Rating:</span>');
			block.append('<span class="rating infotext"><img src="' + data.rating_recent.status + '"/> ' + data.rating_recent.ratio + '%');
		}
    }
}

initializeCache();

function initializeCache() {
    if(localStorage.getItem('tag_cache') === null) {
        localStorage.setItem('tag_cache',JSON.stringify({}));
    }
}

function cache(key, val) {
    if(typeof val === 'undefined' || val === null) {
        return JSON.parse(localStorage.getItem('tag_cache'))[key];
    }
    let json = JSON.parse(localStorage.getItem('tag_cache'));
    json[key] = val;
    localStorage.setItem('tag_cache', JSON.stringify(json));
}

function isCached(key) {
    if(localStorage.getItem('tag_cache') !== null) {
        return typeof JSON.parse(localStorage.getItem('tag_cache'))[key] !== 'undefined';
    }
    return false;
}