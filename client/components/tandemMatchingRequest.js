import {Meteor} from "meteor/meteor";
import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';
import toastr from "toastr";
import {settings} from 'meteor/rocketchat:settings';
import {menu} from 'meteor/rocketchat:ui-utils';
import {t, handleError} from 'meteor/rocketchat:utils';
import {hasRole} from 'meteor/rocketchat:authorization';
import {MatchingRequestStateEnum} from "../../lib/helperData";
import './tandemSidebar.html';

Template.tandemMatchingRequest.onCreated(function () {
	// 1. Instance
	const instance = this;
	// 2. Variables
	this.userMatch = new ReactiveVar(false);
	this.requestDone = new ReactiveVar(false);
	// 3. Autorun
	instance.autorun(function () {
		Meteor.call('tandemUserMatches/getMatchingRequest', instance.data.roomId, function (error, results) {
			if (error) {
				handleError(error);
			}
			instance.userMatch.set(results);
		});
	});

});

Template.tandemMatchingRequest.events({
	'click .js-button-accept'() {
		Meteor.call('tandemUserMatches/acceptTeacherRequest', Session.get('openedRoom'));
		Template.instance().requestDone.set(true);
	},
	'click .js-button-decline'() {
		Meteor.call('tandemUserMatches/declineTeacherRequest', Session.get('openedRoom'));
		Template.instance().requestDone.set(true);
	},
	'click .js-close-flash'() {
		$('.tandem-request-flash').fadeOut();
	}
});

Template.tandemMatchingRequest.onRendered(function () {
	$(function () {
		function hideFlash() {
			$('.tandem-request-flash').fadeOut();
		}

		window.setTimeout(hideFlash, 4000);
	});
});

Template.tandemMatchingRequest.helpers({

	showMatchingRequest() {
		const match = Template.instance().userMatch.get();
		return match.requestedBy !== Meteor.userId() &&
				match.status === MatchingRequestStateEnum.PENDING &&
				 !Template.instance().requestDone.get();
	},

	Match() {
		return Template.instance().userMatch.get();
	},

	isStudent() {
		return Template.instance().userMatch.get().requestedBy === Meteor.userId();
	},

	showFlash() {
		const match = Template.instance().userMatch.get();
		return (match.status === MatchingRequestStateEnum.DECLINED ||
			     match.status === MatchingRequestStateEnum.PENDING ||
				  match.status === MatchingRequestStateEnum.COMPLETED)
			&& match.requestedBy === Meteor.userId();
	},

	getAcceptText() {
		return t('tandem_request_accept');
	},

	getDeclineText() {
		return t('tandem_request_decline');
	},
});
