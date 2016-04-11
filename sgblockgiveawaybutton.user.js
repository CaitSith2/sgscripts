// ==UserScript==
// @name         SG Block Giveaway Button
// @namespace    com.parallelbits
// @version      1.06
// @description  Add a Button to Giveawaypage to block the game
// @author       Daerphen
// @match        http://www.steamgifts.com/giveaway/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

let game_name = $('title').text();
let uri = $('a.global__image-outer-wrap--game-large').attr('href');
let XSRF = null;
let popup = null;
let game_id = null;
let hide_button = null;
let status = false;
let enter_button_text = null;

function _addButton() {
    if(XSRF !== null && hide_button === null) {
        hide_button = '<h3 class="sidebar__heading">Giveaway Filters</h3><ul class="sidebar__navigation">' + 
            '<li id="hide-header" class="sidebar__navigation__item">' + 
            '' + 
            '</li></ul>';
        
        let sidebar = $('div[class="sidebar sidebar--wide"]');
        sidebar.append(hide_button);
        $('#hide-header').append('<a id="hide-game" href="javascript:void(0)" class="sidebar__navigation__item__link"><div class="sidebar__navigation__item__name">Hide Game</div></a>');
        $('#hide-header').append('<a id="unhide-game" href="javascript:void(0)" class="sidebar__navigation__item__link"><div class="sidebar__navigation__item__name">Unhide Game</div></a>');
        console.log(status);
        if(status) {
            $('#hide-game').addClass('is-hidden');
        } else {
            $('#unhide-game').addClass('is-hidden');
        }
        $('#hide-game').on('click', function() {
            let sink = 'http://www.steamgifts.com/ajax.php';
            let data = {
                "xsrf_token": XSRF,
                "do": "hide_giveaways_by_game_id",
                "game_id": game_id
            };
            $.ajax(sink, {
                data: data,
                type: "POST"
            }).done(function() {
                status = true;
                _updateButton();
            });
        });
        $('#unhide-game').on('click', function() {
            let sink = 'http://www.steamgifts.com/ajax.php';
            let data = {
                "xsrf_token": XSRF,
                "do": "remove_filter",
                "game_id": game_id
            };
            $.ajax(sink, {
                data: data,
                type: "POST"
            }).done(function() {
                status = false;
                _updateButton();
            });
        });
    }
}

function _updateButton() {
    let buttonText = enter_button_text;
    
    
    if(status) {
        $('#hide-game').addClass('is-hidden');
        $('#unhide-game').removeClass('is-hidden');
        buttonText = buttonText.replace(/Enter Giveaway/g, 'Giveaway blocked');
        let enterButton = $('div.sidebar__entry-insert');
        if(enterButton.length) {
            enterButton.removeClass('sidebar__entry-insert').addClass('sidebar__error');
            enterButton.html(buttonText);
        }
    } else {
        $('#hide-game').removeClass('is-hidden');
        $('#unhide-game').addClass('is-hidden');
        let enterButton = $('div.sidebar__error');
        if(enterButton.length) {
            enterButton.removeClass('sidebar__error').addClass('sidebar__entry-insert');
            enterButton.html(buttonText);
        }
    }
    
    
    
}

function _setXSRF(context) {
    popup = $(context);
    XSRF = popup.find('input[name="xsrf_token"]').attr('value');
    _addButton();
}

function _setGameId(context) {
    let data = JSON.parse(context);
    $(data.html).find('a.table__column__secondary-link').each(function(index, value) {
        if($(value).attr('href') === uri) {
            game_id = $(value).parent().parent().parent().parent().attr('data-autocomplete-id');
        }
    });
}

function _setStatus(context) {
    let hit = 0;
    $(context).find('div.table__rows p a.table__column__secondary-link').each(function(i, value) {
        if($(value).attr('href') === uri) {
            hit++;
        }
    });
    if(hit > 0) {
        status = true;
    } else {
        status = false;
    }
    
    enter_button_text = $('div.sidebar__entry-insert').html();
}

$.ajaxSetup({
  xhrFields: {
    withCredentials: true
  }
});



let gameFetchURL = 'http://www.steamgifts.com/ajax.php';
let searchData = {
    'do': 'autocomplete_game',
    'search_query': game_name.replace(/ /g, '+'),
    'page_number': 1
}
$.ajax(gameFetchURL, {
    async: true,
    method: 'post',
    data: searchData
}).done(function(context) {
    _setGameId(context);
    let popupURL = 'http://www.steamgifts.com';
    $.ajax(popupURL, {
        async: true
    }).done(function(context) {
        _setXSRF(context);
    });
});

let statusURL = 'http://www.steamgifts.com/account/settings/giveaways/filters/search?q=' + game_name.replace(/ /g, '+');
$.ajax(statusURL).done(function(context) {
    _setStatus(context);
});
        
        