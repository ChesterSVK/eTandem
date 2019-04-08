import {Meteor} from 'meteor/meteor';
import {hasPermission} from 'meteor/rocketchat:authorization';
import {Roles, Users} from 'meteor/rocketchat:models';
import {getUserPreference} from 'meteor/rocketchat:utils';
import TandemUserLanguages from '../models/TandemUserLanguages'
import TandemUsersMatches from '../models/TandemUsersMatches'
import TandemLanguageMatches from '../models/TandemLanguageMatches'
import {TeachingMotivationEnum, LanguageLevelsEnum, MatchingRequestStateEnum} from "../../lib/helperData";

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
				//To allow (greater or equal) or (smaller or equal)
				if (comparator) {
					resLevels.push(LanguageLevelsEnum[property])
				}
			}
		}
	}
	return resLevels;
}

function createLanguagesLevelObject(languagesToTeach) {
	// Object format:
	// { langId : langLevel, ... }
	const result = {};
	languagesToTeach.forEach(function (languageToTeach) {
		result[languageToTeach.langId] = languageToTeach.levelId;
	});
	return result;
}


function createSymetricMatches(user, otherUsersLanguagePreferences, newLangPreferenceMotivation) {

	if (!otherUsersLanguagePreferences.length) return;

	const usersLanguagesWithOppositeMotivation = TandemUserLanguages.findUserLanguages(
		user._id,
		negateMotivation(newLangPreferenceMotivation)
	).fetch();

	if (!usersLanguagesWithOppositeMotivation.length) return;

	let languageLevelsObject = createLanguagesLevelObject(usersLanguagesWithOppositeMotivation);

	otherUsersLanguagePreferences.forEach(function (languagePreferenceOfOtherUser) {
		TandemUserLanguages.findUserLanguages(
			languagePreferenceOfOtherUser.userId,
			newLangPreferenceMotivation
		).fetch().forEach(function (userLanguagePreference) {
			if (otherUserIsNotAlreadyInSomeMatch(userLanguagePreference)){
				createSuitableMatches(userLanguagePreference, languageLevelsObject, newLangPreferenceMotivation, languagePreferenceOfOtherUser, user);
			}
			else {
				if (getUserPreference(userLanguagePreference.userId, 'tandemAllowMultipleTeachings', false)){
					createSuitableMatches(userLanguagePreference, languageLevelsObject, newLangPreferenceMotivation, languagePreferenceOfOtherUser, user);
				}
			}
		});
	});
}

function otherUserIsNotAlreadyInSomeMatch(userLanguagePreference) {
	return TandemUsersMatches.findWithOptions({
		$or: [
			{
				"matchingLanguage.matchingLanguageId": userLanguagePreference.langId,
				"matchingLanguage.matchingLanguageTeacherId": {$ne: userLanguagePreference.userId},
				"symetricLanguage.symetricLanguageTeacherId": userLanguagePreference.userId
			},
			{
				"symetricLanguage.symetricLanguageId": userLanguagePreference.langId,
				"symetricLanguage.symetricLanguageTeacherId": {$ne: userLanguagePreference.userId},
				"matchingLanguage.matchingLanguageTeacherId": userLanguagePreference.userId,
			},
		],
	}).count() === 0;
}

function createSuitableMatches(userLanguagePreference, languageLevelsObject, newLangPreferenceMotivation, languagePreferenceOfOtherUser, user) {
	//symetric match not found in the lang levels object
	if (languageLevelsObject[userLanguagePreference.langId] === undefined) return;
	// Match for learning
	if (newLangPreferenceMotivation === TeachingMotivationEnum.WTLEARN) {
		if (getLanguageLevels(
			languageLevelsObject[userLanguagePreference.langId],
			negateMotivation(newLangPreferenceMotivation)
		).includes(userLanguagePreference.levelId)) {

			TandemLanguageMatches.createSymetricMatchAsStudent(user._id, languagePreferenceOfOtherUser, userLanguagePreference.langId);
		}
	}
	// Match for teaching
	if (newLangPreferenceMotivation === TeachingMotivationEnum.WTTEACH) {
		if (getLanguageLevels(
			languageLevelsObject[userLanguagePreference.langId],
			negateMotivation(newLangPreferenceMotivation)
		).includes(userLanguagePreference.levelId)) {

			TandemLanguageMatches.createSymetricMatchAsTeacher(user._id, languagePreferenceOfOtherUser, userLanguagePreference.langId);
		}
	}
}


// function getUserExistingMatches(userId, languageId) {
// 	return TandemUsersMatches.findWithOptions(
// 		{
// 			$or: [
// 				{
// 					"matchingLanguage.matchingLanguageId": languageId,
// 					"matchingLanguage.matchingLanguageTeacherId": userId
// 				},
// 				{
// 					"symetricLanguage.symetricLanguageId": languageId,
// 					"symetricLanguage.symetricLanguageTeacherId": userId
// 				},
// 			],
// 			status: {$in: [MatchingRequestStateEnum.ACCEPTED, MatchingRequestStateEnum.PENDING]},
// 			unmatched: false
// 		});
// }

function getExistingMatchesNotEqualToUser(userId, languageId) {
	return TandemUsersMatches.findWithOptions(
		{
			$or: [
				{
					"matchingLanguage.matchingLanguageId": languageId,
					"matchingLanguage.matchingLanguageTeacherId": {$ne: userId}
				},
				{
					"symetricLanguage.symetricLanguageId": languageId,
					"symetricLanguage.symetricLanguageTeacherId": {$ne: userId}
				},
			],
			status: {$in: [MatchingRequestStateEnum.ACCEPTED, MatchingRequestStateEnum.PENDING]},
			unmatched: false
		});
}


Meteor.methods({
	executeLanguageMatching(userId, newLangPreferences) {
		if (!userId) return false;

		if (!Array.isArray(newLangPreferences)) return false;

		if (!newLangPreferences.length) newLangPreferences = TandemUserLanguages.findByUserId(userId).fetch();

		if (!newLangPreferences.length) return false;

		return execute(userId, newLangPreferences);
	},
});

function execute(userId, newLangPreferences) {
	const user = Users.findOneById(userId);

	TandemLanguageMatches.removeMatchesWhereUser(userId);

	//Filter preferences by already existing matches
	const filteredPreferences = newLangPreferences.filter(newLangPreference => {
		return getExistingMatchesNotEqualToUser(newLangPreference.userId, newLangPreference.langId).count() === 0;
	});

	filteredPreferences.forEach(function (filteredPreference) {

		// Find language preference matches
		const allMatchingLanguagePreferencesExceptUser = TandemUserLanguages.findLanguageMatches(
			userId,
			negateMotivation(filteredPreference.motivation),
			filteredPreference.langId,
			getLanguageLevels(filteredPreference.levelId, filteredPreference.motivation)
		).fetch();

		// //Filter those who already teach something and does not want to teach more
		// const filteredMatchingLanguagePreferencesExceptUser = allMatchingLanguagePreferencesExceptUser.filter(preferenceItem => {
		// 	if (getUserPreference(preferenceItem.userId, 'tandemAllowMultipleTeachings', false)) {
		// 		return true;
		// 	}
		// 	else {
		// 		return getUserExistingMatches(preferenceItem.userId, preferenceItem.langId).count() === 0;
		// 	}
		// });

		createSymetricMatches(user, allMatchingLanguagePreferencesExceptUser, filteredPreference.motivation);
	});

	return true;
}
