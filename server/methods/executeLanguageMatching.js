import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {hasPermission} from 'meteor/rocketchat:authorization';
import {Roles} from 'meteor/rocketchat:models';
import { getUserPreference } from 'meteor/rocketchat:utils';
import TandemUserLanguages from '../models/TandemUserLanguages'
import TandemLanguageMatches from '../models/TandemLanguageMatches'
import {TeachingMotivationEnum, LanguageLevelsEnum} from "../../lib/helperData";
import TandemLanguageLevels from "../models/TandemLanguageLevels";

function negateMotivation(motivation) {
	if (motivation === TeachingMotivationEnum.WTLEARN) {
		return TeachingMotivationEnum.WTTEACH;
	}
	if (motivation === TeachingMotivationEnum.WTTEACH) {
		return TeachingMotivationEnum.WTLEARN;
	}
}

function getLanguageLevels(levelId, motivation) {
	let comparator = false;
	if (motivation === TeachingMotivationEnum.WTLEARN) {
		comparator = false;
	}
	if (motivation === TeachingMotivationEnum.WTTEACH) {
		comparator = true;
	}

	let resLevels = [];
	for (let property in LanguageLevelsEnum) {
		if (LanguageLevelsEnum.hasOwnProperty(property)) {
			if (comparator) {
				resLevels.push(LanguageLevelsEnum[property])
			}
			if (LanguageLevelsEnum[property] === levelId) {
				comparator = !comparator;
				//To allow greater or equal or smaller or equal
				if (comparator) {
					resLevels.push(LanguageLevelsEnum[property])
				}
			}


		}
	}
	return resLevels;
}

function createSymetricMatches(languageMatches, myMotivation, symetricLanguageLevels) {

	if (!languageMatches.length) return;

	const myLanguagesToTeach = TandemUserLanguages.findUserLanguages(Meteor.userId(), negateMotivation(myMotivation)).fetch();

	if (!myLanguagesToTeach.length) return;


	let result = {};

	myLanguagesToTeach.forEach(function (myLanguageToTeach) {
		result[myLanguageToTeach.langId] = myLanguageToTeach.levelId;
	});

	languageMatches.forEach(function (languageMatch) {
		TandemUserLanguages.findUserLanguages(languageMatch.userId, myMotivation).fetch().forEach(function (matchsLanguageToLearn) {


			if (result[matchsLanguageToLearn.langId] !== undefined) {
				//symetric match found
				if (myMotivation === TeachingMotivationEnum.WTLEARN) {
					if (symetricLanguageLevels) {


						if (getLanguageLevels(result[matchsLanguageToLearn.langId], negateMotivation(myMotivation)).includes(matchsLanguageToLearn.levelId)) {
							TandemLanguageMatches.createSymetricMatchAsStudent(Meteor.userId(), languageMatch , matchsLanguageToLearn.langId, symetricLanguageLevels);
						}
					}
					else {
						TandemLanguageMatches.createSymetricMatchAsStudent(Meteor.userId(), languageMatch , matchsLanguageToLearn.langId, symetricLanguageLevels);
					}
				}
				if (myMotivation === TeachingMotivationEnum.WTTEACH) {
					if (symetricLanguageLevels) {

						if (getLanguageLevels(result[matchsLanguageToLearn.langId], negateMotivation(myMotivation)).includes(matchsLanguageToLearn.levelId)) {
							TandemLanguageMatches.createSymetricMatchAsTeacher(Meteor.userId(), languageMatch , matchsLanguageToLearn.langId, symetricLanguageLevels);
						}
					}
					else {
						TandemLanguageMatches.createSymetricMatchAsTeacher(Meteor.userId(), languageMatch , matchsLanguageToLearn.langId, symetricLanguageLevels);
					}
				}
			}
		});
	});
}

function createAsymetricMatches(languageMatches, myMotivation) {

	languageMatches.forEach(function (languageMatch) {
		if (myMotivation === TeachingMotivationEnum.WTLEARN) {
			TandemLanguageMatches.createAsymetricMatchAsStudent(Meteor.userId(), languageMatch);
		}
		if (myMotivation === TeachingMotivationEnum.WTTEACH) {
			TandemLanguageMatches.createAsymetricMatchAsTeacher(Meteor.userId(), languageMatch);
		}

	});
}


Meteor.methods({
	executeLanguageMatching(userId, newLangPreferences) {
		if (!userId) {
			return;
		}
		if (!Array.isArray(newLangPreferences)) {
			return;
		}

		const symetricMatches = getUserPreference(Meteor.user(), 'tandemSymetricMatching', true);
		const symetricLanguageLevels = getUserPreference(Meteor.user(), 'tandemSymetricLanguageLevels', true);

		TandemLanguageMatches.removeMatchesWhereUser(userId);

		newLangPreferences.forEach(function (langPref) {

			// Find language preference matches
			const asymetricMatches = TandemUserLanguages.findLanguageMatches(Meteor.userId(), negateMotivation(langPref.motivation), langPref.langId, getLanguageLevels(langPref.levelId, langPref.motivation)).fetch();

			if (symetricMatches) {
				createSymetricMatches(asymetricMatches, langPref.motivation, symetricLanguageLevels);
			}
			else {
				createAsymetricMatches(asymetricMatches, langPref.motivation);
			}
		});
	},
});

// todo wait for this call because it takes time to propagate it everywhere
