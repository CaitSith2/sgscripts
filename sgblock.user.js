// ==UserScript==
// @name         SG Blocked Games
// @namespace    com.parallelbits
// @version      1.03
// @description  Notify within a giveaway if you blocked it
// @author       Daerphen
// @match        http://www.steamgifts.com/giveaway/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var SG_FILTER_PATH = 'http://www.steamgifts.com/account/settings/giveaways/filters/search';

function _blockGame(context, storeuri) {
    var hit = 0;
    $(context).find('div.table__rows p a.table__column__secondary-link').each(function(i, value) {
        if($(value).attr('href') === storeuri) {
            hit++;
        }
    });
    if(hit > 0) {
        var item = $('div.sidebar__entry-insert')
        item.removeClass('sidebar__entry-insert').addClass('sidebar__error');
        var text = item.text();
        item.text(text.replace(/Enter Giveaway/g, "Giveaway blocked "));
    }
}

var name = $('div.featured__heading__medium').text();
var storeUri = $('a.global__image-outer-wrap--game-large').attr('href');

var page = SG_FILTER_PATH + '?q=';
name = name.replace(/ /g, "%20");
var uri = page + name;
$.ajax(uri, {
  async: true
}).done(function(context) {
    _blockGame(context, storeUri);
});
