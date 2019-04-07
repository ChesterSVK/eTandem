import {Meteor} from 'meteor/meteor';
import TandemUserLanguages from '../models/TandemUserLanguages';
import TandemLanguageMatches from '../models/TandemLanguageMatches';
import TandemLanguages from '../models/TandemLanguages';
import TandemUsersMatches from '../models/TandemUsersMatches';
import {TeachingMotivationEnum, MatchingRequestStateEnum} from "../../lib/helperData";
import {Users} from 'meteor/rocketchat:models';
import {getUserPreference} from 'meteor/rocketchat:utils';


function getTeacherId(users, actualUser) {
	if (users[0] === actualUser) {
		return users[1];
	}
	else {
		return users[0];
	}
}

Meteor.methods({
	'tandemUserLanguageMatches/get'() {
		if (!this.userId) {
			return this.ready();
		}

		const actualUserId = this.userId;


		//Get my learning preferences
		const myLanguagesToLearn = TandemUserLanguages.findUserLanguages(actualUserId, TeachingMotivationEnum.WTLEARN).fetch();
		if (!Array.isArray(myLanguagesToLearn)) {
			return [];
		}
		Meteor.call('executeLanguageMatching', this.userId, myLanguagesToLearn);

		let matchingResults = [];
		myLanguagesToLearn.forEach(function (languageToLearn) {

			const languageName = TandemLanguages.findOneById(languageToLearn.langId).name;
			const existingMatches = TandemUsersMatches.findWithOptions({
				$or: [
					{
						"matchingLanguage.matchingLanguageId": languageToLearn.langId,
						"matchingLanguage.matchingLanguageTeacherId": {$ne: actualUserId},
						"symetricLanguage.symetricLanguageTeacherId": actualUserId
					},
					{
						"symetricLanguage.symetricLanguageId": languageToLearn.langId,
						"symetricLanguage.symetricLanguageTeacherId": {$ne: actualUserId},
						"matchingLanguage.matchingLanguageTeacherId": actualUserId,
					},
				],
				status: {$in: [MatchingRequestStateEnum.ACCEPTED, MatchingRequestStateEnum.PENDING]},
				unmatched: false
			}).fetch();
			if (existingMatches.length) {
				matchingResults.push({
					languageName: languageName,
					languageId: languageToLearn.langId,
					// languagePreference: languageToLearn,
					alreadyExists: true,
					existingRoom: existingMatches[0].roomId,
					skip: true,
				});
			}
			else {
				matchingResults.push({
					languageName: languageName,
					languageId: languageToLearn.langId,
					// languagePreference: languageToLearn,
					matches: [],
					alreadyExists: false,
					existingRoom: false,
					skip: false,
				});
			}

		});

		matchingResults.forEach(function (matchingResult) {
			if (!matchingResult.skip){
				createMatchmakingData(matchingResult, actualUserId);
			}
		});
		return matchingResults;
	},
});


function createMatchmakingData(matchingResult, actualUserId){
	//Get excluded users ids
	const excludedUsersIds = Users.find({
		'settings.preferences.tandemExcludeFromMatching': true,
	}, {
		fields: {
			_id: 1,
		}
	}).fetch().map(idObject => idObject._id);


	const query = {
		usersInMatch: actualUserId,
		languagesInMatch: matchingResult.languageId,
		symetric: true,
	};

	const langMatches = TandemLanguageMatches.findMatches(query).fetch();

	const filteredExcludedMatches = langMatches.filter(function (match) {
		if (match.usersInMatch.length !== 2) {
			return false;
		}
		const otherUser = getTeacherId(match.usersInMatch, actualUserId);
		if (excludedUsersIds.includes(otherUser)){
			return false;
		}
		if (match.hidden){
			return false;
		}
		return true;
	});

	addFittingLanguageMatches(actualUserId, filteredExcludedMatches, matchingResult);
}

function addFittingLanguageMatches(actualUserId, languageMatches, matchingResult) {

	matchingResult.matches = languageMatches.map(function (item) {
		return {
			_id: item._id,
			teacher: Users.findOneById(getTeacherId(item.usersInMatch, actualUserId)),
			matchingLanguage: matchingResult.languageName,
			languagesInMatch: item.languagesInMatch.map(function (lang) {
				return TandemLanguages.findOneById(lang).name;
			})
		};
	});
}
