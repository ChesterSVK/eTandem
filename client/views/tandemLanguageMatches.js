import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { settings } from 'meteor/rocketchat:settings';
import TandemMatches from '../components/react/MatchMaking/TandemMatches'

Template.tandemLanguageMatches.onCreated(function () {
	// 1. Instance
	const instance = this;
	this.languageMatches = new ReactiveVar([]);
	// 2. Autorun
	instance.autorun(function () {
		Meteor.call('tandemUserLanguageMatches/get', function(error, results) {
			if (error) {
				handleError(error);
			}

			instance.languageMatches.set(results);
			return results;
		});
	});
})
;

Template.tandemLanguageMatches.helpers({
	MatchMaking(){
		return TandemMatches;
	},
	getLanguageMatches(){
		return Template.instance().languageMatches.get();
	}
});
