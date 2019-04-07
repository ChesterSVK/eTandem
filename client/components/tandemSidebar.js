import {Template} from 'meteor/templating';
import {settings} from 'meteor/rocketchat:settings';
import './tandemSidebar.html';
import SimpleList from './react/SideBar/SideBar';
import {Meteor} from "meteor/meteor";
import { menu } from 'meteor/rocketchat:ui-utils';
import { handleError } from 'meteor/rocketchat:utils';



Template.tandemSidebar.onCreated(function () {
// 1. Instance
	const instance = this;
	this.hasUserMatches = new ReactiveVar(false);
	// 2. Autorun
	instance.autorun(function () {
		Meteor.call('hasUserMatches', function (error, results) {
			if (error) {
				handleError(error);
			}

			instance.hasUserMatches.set(results);
			return results;
		});
	});
})
;

Template.tandemSidebar.events({
	'click .tandem-link' () {
		menu.close();
	}
});


Template.tandemSidebar.helpers({
	hasUserMatches() {
		return Template.instance().hasUserMatches.get();
	},
	TandemSidebar() {
		return SimpleList;
	}
});
