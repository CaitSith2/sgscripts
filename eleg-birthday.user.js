// ==UserScript==
// @name         ELEG Birthday Giveaway Helper
// @namespace    http://www.parallel-bits.de
// @version      0.1
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
        if(isMemberOf(g.id)) {
            // is member of
            var button = $('<div id="b'+g.id+'" class="form__submit-button js__submit-form"><i class="fa fa-arrow-circle-right"></i>'+g.name+'</div>');
            button.click(function() {
                performAction(g.id);
            });
            $('#autofill-row').append(button);
        } else {
            console.log('not a group member');
        }
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
		console.log(group);
		$('div[data-checkbox-value="groups"]').trigger('click');
        var groupSelectioButton = $('div[data-group-id="' + group + '"]');
		console.log(groupSelectioButton);
		if(!groupSelectioButton.hasClass('is-selected')) {
			//groupSelectioButton.trigger('click');
			$("div[data-group-id='" + group + "']").children('div').eq(1).trigger("click");
		}
	}
	function setDescription() {
		$('textarea[name="description"]').val(description);
	}
	function performAction(group) {
		var starting_day = 20;
		var ending_day = 30;
		var current_date = new Date();
		var current_month = current_date.getMonth();
		var current_year = current_date.getYear();
		if(current_month == 1) {
			ending_day = 28;
		}
        var start = maxDate(new Date(), new Date('01/01/2017 08:00:00 UTC'));
		var end = new Date('01/30/2017 18:00:00 UTC');
		insertDates(start, end);
		setRegionRestriction();
		setGroups(''+group);
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
