// ==UserScript==
// @name        SG BundleMarker
// @namespace   com.parallelbits
// @description Marks Bundlegames when you create a giveaway
// @include     http://www.steamgifts.com/giveaways/new
// @version     1.0
// @grant       none
// ==/UserScript==

let finalEvent = null;
let timer = null;
let unlockTimer = null;
let BUNDLE_LIST = 'http://www.steamgifts.com/bundle-games/search?q=';
let lock = false;

$('.js__autocomplete-data').bind('DOMNodeInserted DOMSubtreeModified DOMNodeRemoved', function(event) {
    if(!lock) {
        finalEvent = event;
        if(timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(_addMarkers, 300);
    }
});

function _addMarkers() {
    lock = true;
    if(timer !== null) {
        clearTimeout(timer);
        timer = null;
    }
    $('.table__row-outer-wrap').each(function(index, value) {
        let item = $(this);
        let name = $(value).attr('data-autocomplete-name');
        let uri = $(value).find('.table__column__secondary-link').attr('href');
        let ajaxURI = BUNDLE_LIST + name.replace(/ /g, '+');
        $.ajax(ajaxURI).done(function(context) {
            let hit = 0;
            $(context).find('div.table__rows p a.table__column__secondary-link').each(function(i, v) {
                if($(v).attr('href') === uri) {
                    hit++;
                }
            });
            if(hit > 0) {
                item.find('.global__image-outer-wrap').parent().before('<div>*</div>');
                if(unlockTimer !== null) {
                    clearTimeout(unlockTimer);
                    unlockTimer = null;
                }
                unlockTimer = setTimeout(_unlock, 500);
            }
        });
    });
}

function _unlock() {
    if(unlockTimer !== null) {
        clearTimeout(unlockTimer);
        unlockTimer = null;
    }
    lock = false;
}