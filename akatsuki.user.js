// ==UserScript==
// @name         AKATSUKI Giveaway Helper
// @namespace    http://www.parallel-bits.de
// @version      0.4
// @description  Helps to create monthly giveaways for AKATSUKI. Set group, start and end date and standard description
// @author       Daerphen
// @match        https://www.steamgifts.com/giveaways/new
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var description = '### Monthly giveaway';
	var groupId = '835390303';
	var button = $('<div id="akatsuki" class="form__submit-button js__submit-form"><i class="fa fa-arrow-circle-right"></i> Akatsuki</div>');
	button.click(function() {
		performAction()
	});
	$('.page__heading').append(button);
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
	function setGroups() {
		$('div[data-checkbox-value="groups"]').trigger('click');
        var akatsuki = $('div[data-group-id="' + groupId + '"]');
		if(!akatsuki.hasClass('is-selected')) {
			akatsuki.trigger('click');
		}
	}
	function setDescription() {
		$('textarea[name="description"]').val(description);
	}
	function performAction() {
		var ending_day = 30;
		var current_date = new Date();
		var current_day = current_date.getDate();
		var current_month = current_date.getMonth();
		var current_year = current_date.getYear();
		if(current_day >= 28) {
			if(current_month == 11) {
				current_year += 1;
			}
			current_month += 1;
			current_month %= 12;
		}
		if(current_month == 1) {
			ending_day = 28;
		}
		var start = new Date();
		var end = new Date((current_month + 1) + '/' + ending_day + '/' + (current_year+1900) + ' 18:00:00 GMT');
		insertDates(start, end);
		setRegionRestriction();
		setGroups();
		setDescription();
	}
})();