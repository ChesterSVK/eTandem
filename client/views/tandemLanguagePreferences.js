import { Template } from 'meteor/templating';
import TandemPreferences from '../components/react/Preferences/TandemPreferences';
import TandemLanguages from '../models/TandemLanguages'
import TandemUserLanguages from '../models/TandemUserLanguages'
import {TeachingMotivationEnum, getLevelsAsArray} from '../../lib/helperData'
import { t } from 'meteor/rocketchat:utils';

Template.tandemLanguagePreferences.onCreated(function () {
	// 1. Instance
	const instance = this;
	this.languages = new ReactiveVar([]);
	this.languageLevels = getLevelsAsArray();
	this.teachingLanguages = new ReactiveVar([]);
	this.learningLanguages = new ReactiveVar([]);

	// 2. Autorun
	instance.autorun(function () {
		// subscribe to the posts publication
		let subscriptionLanguages = instance.subscribe('tandemLanguages');
		let subscriptionUserLanguages = instance.subscribe('tandemUserLanguages');

		// if subscription is ready, init structures
		if (subscriptionLanguages.ready()) {
			instance.languages.set(TandemLanguages.find({}).fetch());
		}

		// if subscription is ready, init structures
		if (subscriptionUserLanguages.ready()) {
			instance.teachingLanguages.set(TandemUserLanguages.findLanguagesWithMotivation(TeachingMotivationEnum.WTTEACH).fetch());
			instance.learningLanguages.set(TandemUserLanguages.findLanguagesWithMotivation(TeachingMotivationEnum.WTLEARN).fetch());
		}

	});
})
;

Template.tandemLanguagePreferences.onRendered(function() {
	$('#tandemLoading').hide();
});

Template.tandemLanguagePreferences.helpers({
	title(){
		return t("Preferences");
	},
	getLearningPreferences(){
		return Template.instance().learningLanguages.get();
	},
	getTeachingPreferences(){
		return Template.instance().teachingLanguages.get();
	},
	getTandemLanguages(){
		return Template.instance().languages.get();
	},
	getTandemLanguageLevels(){
		return Template.instance().languageLevels.get();
	},
	TandemPreferences() {
		return TandemPreferences;
	}
});
