import {Template} from 'meteor/templating';
import {settings} from 'meteor/rocketchat:settings';
import './tandemSidebar.html';
import SimpleList from './react/SideBar/SideBar';
import {Meteor} from "meteor/meteor";
import TandemMatches from "./react/MatchMaking/TandemMatches";
import { menu } from 'meteor/rocketchat:ui-utils';



Template.tandemSidebar.onCreated(function () {
// 1. Instance
	const instance = this;
	this.hasUserStudents = new ReactiveVar(false);
	// 2. Autorun
	instance.autorun(function () {
		Meteor.call('hasUserStudents', function (error, results) {
			if (error) {
				handleError(error);
			}

			instance.hasUserStudents.set(results);
			return results;
		});
	});
})
;

Template.tandemSidebar.rendered = function () {

};

Template.tandemSidebar.events({
	'click .tandem-link' () {
		menu.close();
	}
});


Template.tandemSidebar.helpers({
	hasUserStudents() {
		return Template.instance().hasUserStudents.get();
	},
	TandemSidebar() {
		return SimpleList;
	}
});
