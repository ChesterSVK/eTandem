import TandemListMatches from '../components/react/MatchMaking/ListMatches';
import { t, handleError } from 'meteor/rocketchat:utils';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

Template.tandemListMatches.onCreated(function () {
	// 1. Instance
	const instance = this;
	this.userMatches = new ReactiveVar([]);

	// 2. Autorun
	instance.autorun(function () {
		Meteor.call('tandemUserMatches/getAllMatches', function(error, results) {
			if (error) {
				handleError(error);
			}

			instance.userMatches.set(results);
			return results;
		});
	});
})
;

Template.tandemListMatches.onRendered(function() {
});

Template.tandemListMatches.helpers({
	title(){
		return t("List_Matches");
	},
	TandemListMatches() {
		return TandemListMatches;
	},
	getMyMatches(){
		return Template.instance().userMatches.get();
	}
});
