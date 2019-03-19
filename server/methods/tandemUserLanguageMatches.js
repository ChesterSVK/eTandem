import {Meteor} from 'meteor/meteor';
import TandemUserLanguages from '../models/TandemUserLanguages';
import TandemLanguages from '../models/TandemLanguages';
import TandemUsersMatches from '../models/TandemUsersMatches';
import {TeachingMotivationEnum} from "../../lib/teachingMotivation";
import { Users } from 'meteor/rocketchat:models';
import TandemLanguageLevels from "../models/TandemLanguageLevels";

function getHigherOrEqualLanguageLevels(levelId){
	let levels = TandemLanguageLevels.findAll().fetch();
	levels = levels.sort(function(a, b) {
		return a.level.localeCompare(b.level, undefined, {
			numeric: true,
			sensitivity: 'base'
		});
	});
	let fromThisPoint = false;
	let resLevels = [];
	for (let i = 0 ; i < levels.length; i++){
		if (levels[i]._id === levelId){
			fromThisPoint = true;
		}
		if (fromThisPoint){
			resLevels.push(levels[i]._id)
		}
	}
	return resLevels;
}

Meteor.methods({
	'tandemUserLanguageMatches/get'() {
		if (!this.userId) {
			return this.ready();
		}

		//Todo if user is not reported
		//Todo if language is not already in match

		const options = {
			fields: {
				_id: 1,
				userId: 1,
				motivation: 1,
				langId: 1
			},
		};

		const myLanguagesToLearn = TandemUserLanguages.findUserLanguages(this.userId, TeachingMotivationEnum.WTLEARN).fetch();

		let result = [];

		if (!Array.isArray(myLanguagesToLearn)) {
			return [];
		}

		myLanguagesToLearn.forEach(function (languageToLearn) {
			// Find language preference matches

			const langMatches = TandemUserLanguages.findLanguageMatches(Meteor.userId(), TeachingMotivationEnum.WTTEACH, languageToLearn.langId, getHigherOrEqualLanguageLevels(languageToLearn.levelId) ).fetch();
			const fields = {
				studentId: Meteor.userId(),
				unmatched: false,
				langId: languageToLearn._id
			};
			// Find all existing matches to these preferences
			const usersMatches = TandemUsersMatches.find(fields).fetch();
			// If there is no match exists push found matches users
			if (usersMatches.length === 0){
				const userLanguageMatchesIds = langMatches.map(function (item) {
					return item.userId;
				});
				result.push({
						languageName : TandemLanguages.findOneById(languageToLearn.langId).name,
						languagePreference: languageToLearn,
						teachers: Users.findUsersByIds(userLanguageMatchesIds).fetch()
					}
				);
			}
		});

		// todo lang levels

		return result;
	},
});
