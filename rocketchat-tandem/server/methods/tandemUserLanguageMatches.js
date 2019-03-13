import {Meteor} from 'meteor/meteor';
import TandemUserLanguages from '../models/TandemUserLanguages';
import {TeachingMotivationEnum} from "../../lib/teachingMotivation";
import { Users } from 'meteor/rocketchat:models';

Meteor.methods({
	'tandemUserLanguageMatches/get'() {
		if (!this.userId) {
			return this.ready();
		}

		//Todo if this already was an match
		//Todo if user is not reported
		//Todo if language is not already in match

		const options = {
			fields: {
				_id: 1,
				userId: 1,
				motivation: 1,
				langName: 1
			},
			// sort: {
			// 	: 1,
			// },
		};

		const myLanguagesToLearn = TandemUserLanguages.findUserLanguages(this.userId, TeachingMotivationEnum.WTLEARN).fetch();

		let result = [];

		if (!Array.isArray(myLanguagesToLearn)) {
			return [];
		}

		myLanguagesToLearn.forEach(function (languageToLearn) {
			const matches = TandemUserLanguages.findLanguageMatches(Meteor.userId(), TeachingMotivationEnum.WTTEACH, languageToLearn.langName);
			result.push({
					langName: languageToLearn.langName,
					teachers: Users.find({}).fetch()
				}
			);
		});

		return result;
	},
});
