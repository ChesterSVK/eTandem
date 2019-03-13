import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {settings} from 'meteor/rocketchat:settings';
import './tandemLanguagePreferences.html';
// import TandemHeader from '../components/react/TandemHeader';
import TandemPreferences from '../components/react/Preferences/TandemPreferences';
import TandemLanguages from '../models/TandemLanguages'
import TandemLanguageLevels from '../models/TandemLanguageLevels'
import TandemUserLanguages from '../models/TandemUserLanguages'
import { TeachingMotivationEnum  } from '../../lib/teachingMotivation'
import s from "underscore.string";


Template.tandemLanguagePreferences.onCreated(function () {
	// 1. Instance
	const instance = this;
	this.languages = new ReactiveVar([]);
	this.languageLevels = new ReactiveVar([]);
	this.teachingLanguages = new ReactiveVar([]);
	this.learningLanguages = new ReactiveVar([]);

	// 2. Autorun
	instance.autorun(function () {
		// subscribe to the posts publication
		let subscriptionLanguages = instance.subscribe('tandemLanguages');
		let subscriptionLevels = instance.subscribe('tandemLanguageLevels');
		let subscriptionUserLanguages = instance.subscribe('tandemUserLanguages');

		// if subscription is ready, init structures
		if (subscriptionLanguages.ready()) {
			instance.languages.set(TandemLanguages.find({}));
		}
		// if subscription is ready, init structures
		if (subscriptionLevels.ready()) {
			instance.languageLevels.set(TandemLanguageLevels.find({}));
		}

		// if subscription is ready, init structures
		if (subscriptionUserLanguages.ready()) {
			instance.teachingLanguages.set(TandemUserLanguages.findLanguagesWithMotivation(TeachingMotivationEnum.WTTEACH).fetch());
			instance.learningLanguages.set(TandemUserLanguages.findLanguagesWithMotivation(TeachingMotivationEnum.WTLEARN).fetch());
		}

	});
})
;

Template.tandemLanguagePreferences.rendered = function () {

};

Template.tandemLanguagePreferences.helpers({

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
	// TandemHeader() {
	// 	return TandemHeader;
	// },
	TandemPreferences() {
		return TandemPreferences;
	}
});
