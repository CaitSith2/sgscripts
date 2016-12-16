// ==UserScript==
// @name         ELEG Birthday Giveaway Helper
// @namespace    http://www.parallel-bits.de
// @version      1.3
// @description  Small Helper for ELEG Birthday Event 2016. Sets Region, Groups, Start and End Date
// @author       Daerphen
// @match        https://www.steamgifts.com/giveaways/new
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var groups = [
        {
            id: '591009548',
            name: 'ELEG Birthday (Group A)'
        },{
            id: '591009547',
            name: 'ELEG Birthday (Group B)'
        }
    ];

    var description = '##Everybody Love Everybody 4th Birthday Event  \n\n----------------  \n\nIf you enter our giveaways please [bump the thread](...)  \n\n--------------------  \n\nIf you are interested in joining ELE, please check out our rules and thread - [group thread](https://www.steamgifts.com/discussion/2gTRA/e) ';
	var buttonRow = $('#autofill-row');
    if(!$('#autofill-row').length) {
        $('.form__row--giveaway-keys').after('<div class="form__row"><div class="form__heading"><div class="form__heading__number"></div><div class="form__heading__text">Autofill</div></div><div class="form__row__indent" id="autofill-row"></div></div>');
    }
    for(var g of groups) {
		(function(group) {
			if(isMemberOf(group.id)) {
				// is member of
				var button = $('<div id="b'+group.id+'" class="form__submit-button js__submit-form"><i class="fa fa-arrow-circle-right"></i>'+group.name+'</div>');
				button.click(function() {
					performAction(group);
				});
				$('#autofill-row').append(button);
			}
		})(g);
    }
	function insertDates(start, end) {
		$('input[name="start_time"]').val(formatDate(start));
		$('input[name="end_time"]').val(formatDate(end));
	}
	function formatDate(date) {
		var output = $.datepicker.formatDate('M dd, yy', date);
		var time = extendNumber(date.getHours()%12) + ':' + extendNumber(date.getMinutes()) + ' ' + (date.getHours() < 12 ? 'am' : 'pm');
		return output + ' ' + time;
	}
	function extendNumber(n) {
		if(n < 10) {
			return '0' + n;
		}
		return n;
	}
	function setRegionRestriction() {
		$('div[data-checkbox-value="0"]').trigger('click');
	}
	function setGroups(group) {
		$('div[data-checkbox-value="groups"]').trigger('click');
        var groupSelectionButton = $('div[data-group-id="' + group.id + '"]');
		if(!groupSelectionButton.hasClass('is-selected')) {
			groupSelectionButton.trigger('click');
		}
	}
	function setDescription() {
		$('textarea[name="description"]').val(description);
	}
	function performAction(group) {
        var start = maxDate(new Date(), new Date('01/01/2017 08:00:00 UTC'));
		var end = new Date('01/23/2017 18:00:00 UTC');
		insertDates(start, end);
		setRegionRestriction();
		setGroups(group);
		setDescription();
	}
    function isMemberOf(groupId) {
        var groups = $('div[data-group-id]');
        var res = false;
        groups.each(function(i,g){
            var dataId = $(g).data('group-id');
            if(parseInt(dataId) === parseInt(groupId)) {
                res = true;
            }
        });
        return res;
    }
    function maxDate(a,b) {
        if(a.getTime() < b.getTime()) {
            return b;
        }
        return a;
    }
})();
 

