// ==UserScript==
// @name         SG Blocked Games
// @namespace    com.parallelbits
// @version      0.11
// @description  Notify within a giveaway if you blocked it
// @author       Daerphen
// @match        http://www.steamgifts.com/giveaway/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var SG_FILTER_PATH = 'http://www.steamgifts.com/account/settings/giveaways/filters/search';

function _blockGame(context) {
    var hit = 0;
    $(context).find('div.table__rows p.table__column__heading').each(function(i, value) {
        hit++;
    });
    if(hit > 0) {
        var item = $('div.sidebar__entry-insert')
        item.removeClass('sidebar__entry-insert').addClass('sidebar__error');
        var text = item.text();
        item.text(text.replace(/Enter Giveaway/g, "Giveaway blocked "));
    }
}

var name = $('div.featured__heading__medium').text();

var page = SG_FILTER_PATH + '?q=';
name = name.replace(/ /g, "%20");
var uri = page + name;
$.ajax(uri, {
  async: true
}).done(function(context) {
    _blockGame(context);
});
