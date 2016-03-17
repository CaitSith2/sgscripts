// ==UserScript==
// @name        SG Augmented Gamelist
// @namespace   com.parallelbits
// @description Adds genre tags to game list
// @include     http://www.steamgifts.com/*
// @version     1.07
// @grant       none
// ==/UserScript==
'use strict';

var genre = [];
var PROXY_URL = 'http://proxy.parallel-bits.com/proxy';
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
        console.log("entered");
        _showGameinfo(storeUri, $(storeLink));
    });
    $(storeLink).parent().mouseleave(function(e) {
        console.log("left");
        popup.hide();
    });
    
    _gatherGameinfo(storeUri);
});

function _positionAtElement(popup, element) {
    let pos = element.position();
    let width = element.outerWidth();
    popup.css({
        position: "absolute",
        top: pos.top + "px",
        left: (pos.left + width) + "px"
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

function _gatherGameinfo(uri) {
    var reg = /(app|sub)\/(\d+)/g;
    var data = reg.exec(uri);
    var ajaxURI = PROXY_URL + '?uri=' + data[1] + '/' + data[2];
    $.ajax(ajaxURI, {
        async: true
    }).done(function(context) {
        genre[data[1] + '/' + data[2]] = context;
    });
}

function _showGameinfo(uri, loc) {
    var reg = /(app|sub)\/(\d+)/g;
    var data = reg.exec(uri);
    _openDialog(loc, data[1] + '/' + data[2]);
}

function _openDialog(loc, key) {
    popup.empty();
    let limit = 5;
    popup.append('<span class="label infotext">User Tags:</span>');
    genre[key].tags.forEach(function(value) {
        if(limit > 0) {
            limit--;
            popup.append('<span class="gametag infotext">' + value + '</span>');
        }
    });

    popup.append('<br/><span class="label infotext">Features:</span>');
    genre[key].features.forEach(function(value) {
        popup.append('<span class="gametag infotext"><img width="20" src="' + value + '"</></span>');
    });

    limit = 5;
    popup.append('<br/><span class="label infotext">Genres:</span>');
    genre[key].genres.forEach(function(value) {
        if(limit > 0) {
            limit--;
            popup.append('<span class="gametag infotext">' + value + '</span>');
        }
    });

    if(genre[key].metacritic !== null && typeof genre[key].metacritic !== 'undefined') {
        popup.append('<br/><span class="label infotext">Metacritic:</span>');
        popup.append('<span class="rating infotext">' + genre[key].metacritic + '</span>');
    }
    _positionAtElement(popup, loc);
    popup.show();
}