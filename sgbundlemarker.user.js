// ==UserScript==
// @name        SG BundleMarker
// @namespace   com.parallelbits
// @description Marks Bundlegames when you create a giveaway
// @include     *://www.steamgifts.com/giveaways/new
// @version     1.03
// @grant       none
// ==/UserScript==

let finalEvent = null;
let timer = null;
let unlockTimer = null;
let BUNDLE_LIST = 'https://www.steamgifts.com/bundle-games/search?q=';
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
		let uriData = /http:\/\/store.steampowered.com\/(app|sub)\/([0-9]+)\/?/g.exec(uri);
		if(uriData[1] === 'app') {
			$.ajax('https://proxy-parallelbits.rhcloud.com/proxy?uri=app/' + uriData[2]).done(function(context) {
				let price = Math.round(context.price/100);
				item.find('.global__image-outer-wrap').parent().parent().append('<div><span style="color: black; background-color: #adf7b7; border-radius: 5px; padding: 2px">'+price+'P</span></div>');
			});
		}
        let ajaxURI = BUNDLE_LIST + name.replace(/ /g, '+');
        $.ajax(ajaxURI).done(function(context) {
            let hit = 0;
            $(context).find('div.table__rows p a.table__column__secondary-link').each(function(i, v) {
                if($(v).attr('href') === uri) {
                    hit++;
                }
            });
            if(hit > 0) {
				item.find('.global__image-outer-wrap').parent().parent().append('<div><span style="color: black; background-color: #adc9f7; border-radius: 5px; padding: 2px">bundled</span></div>');
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