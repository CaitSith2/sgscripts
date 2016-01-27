// ==UserScript==
// @name        SG Augmented Gamelist
// @namespace   com.parallelbits
// @description Adds genre tags to game list
// @include     http://www.steamgifts.com/*
// @version     0.1
// @grant       none
// ==/UserScript==

var genre = [];

function _addTags(uri, key) {
  var item = $('h2.giveaway__heading a[href="'+uri+'"]').parent();
  item.find('span').replaceWith('');
  genre[key].forEach(function(value) {
    item.append('<span style="margin-left: 10px; padding: 2px; color: gray; border: 1px solid rgba(0,0,0,.1); border-radius: 4px">'+value.description+'</span>');
  });
}

$('a.giveaway__icon').each(function(i, value) {
  var link = $(this).attr("href");
  var reg = /(?:\/(app)\/([0-9]+)\/)|(?:(sub)\/([0-9]+)\/)/g;
  var data = reg.exec(link);
  if(data[1] === 'app') {
      var appURI = 'http://h2492956.stratoserver.net:8080/SGProxy/proxy?uri=app/' + data[2];
      $.ajax(appURI, {
        async: true
      }).done(function(context) {
        genre['app/'+data[2]] = context[data[2]].data.genres;
        _addTags(value, 'app/'+data[2]);
      });
  } 
});
