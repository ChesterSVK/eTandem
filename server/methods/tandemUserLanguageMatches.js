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

		console.log("MyLanguageToLearn");
		console.log(myLanguagesToLearn);

		const allMineUsersMatches = TandemUsersMatches.find({$or: [{studentId: actualUserId}, {teacherId: actualUserId}]}).fetch();

		console.log("AllMineUsersMatches");
		console.log(allMineUsersMatches);

		//Get excluded users ids
		const excludedUsersIds = Users.find({
			'settings.preferences.tandemExcludeFromMatching': true,
		}, {
			fields: {
				_id: 1,
			}
		}).fetch().map(idObject => idObject._id);


		let matchingResults = [];
		myLanguagesToLearn.forEach(function (languageToLearn) {

			const languageName = TandemLanguages.findOneById(languageToLearn.langId).name;

			matchingResults.push({
				languageName: languageName,
				languageId: languageToLearn.langId,
				// languagePreference: languageToLearn,
				matches: [],
				alreadyExists: false,
				existingRoom: false,
				filter: false,
			});

		});

		console.log("Matching Results");
		console.log(matchingResults);


		//Add Existing Matches
		matchingResults.forEach(function (matchingResult) {

			console.log("Loop1");

			const query = {
				usersInMatch: Meteor.userId(),
				languagesInMatch: matchingResult.languageId,
			};

			if (getUserPreference(Meteor.user(), 'tandemSymetricMatching') === true) {
				query['symetric'] = true;
			}

			const langMatches = TandemLanguageMatches.findMatches(query).fetch();

			console.log("langMatches");
			console.log(langMatches);

			const filteredExcludedMatches = langMatches.filter(function (match) {
				if (match.usersInMatch.length !== 2) {
					return false;
				}
				const otherUser = getTeacherId(match.usersInMatch, actualUserId);
				return !excludedUsersIds.includes(otherUser);
			});

			console.log("langMatchesExcluded");
			console.log(filteredExcludedMatches);

			filteredExcludedMatches.forEach(function (langMatch) {
				console.log("langMatch One ");
				console.log(langMatch);
				if (allMineUsersMatches.length === 0){
					console.log("normal adding matching with empty mine");
					addFittingLanguageMatches(actualUserId, filteredExcludedMatches, matchingResult, false );
				}
				allMineUsersMatches.forEach(function (userMatch) {

					console.log("userMatch One ");
					console.log(userMatch);

					//Whether to check for symetric match
					if (langMatch.symetric) {
						console.log("LANGGGGG");
						console.log(userMatch.symetricLanguage);
						//This should not happen
						if (!(userMatch.symetricLanguage)) {
							console.log("NOOOOOOOOOOOOOOOO SYM LANG IN USER MATCH AND LANG MATCH IS SYM, this should not happen")
						}
						//If both symetric langs in user match
						else if (langMatch.languagesInMatch.includes(userMatch.matchingLanguage) && langMatch.languagesInMatch.includes(userMatch.symetricLanguage)) {
							console.log("both symetric langs in user match");
							if (!userMatch.unmatched) {
								console.log("UNMATched false");
								if (userMatch.status === MatchingRequestStateEnum.DECLINED){
									console.log("DECLINEED");
									addFittingLanguageMatches(actualUserId, filteredExcludedMatches, matchingResult, true, userMatch.languageMatch );
								}
								else {
									console.log("EXISTING");
									//Add existing
									matchingResult.alreadyExists = true;
									matchingResult.existingRoom = userMatch.roomId;
									matchingResult.filter = false;
								}
							}
							else {
								console.log("UNMATCHED true");
								addFittingLanguageMatches(actualUserId, filteredExcludedMatches, matchingResult, true, userMatch.languageMatch );
							}
						}
						else {
							console.log("normal adding matching");
							addFittingLanguageMatches(actualUserId, filteredExcludedMatches, matchingResult, false );
						}
					}
					else {
						if (langMatch.languagesInMatch.includes(userMatch.matchingLanguage)) {
							console.log("match found but asym");
							if (!userMatch.unmatched) {
								//Add existing
								matchingResult.alreadyExists = true;
								matchingResult.existingRoom = userMatch.roomId;
								matchingResult.filter = false;
							}
							else {
								// add all but this
								addFittingLanguageMatches(actualUserId, filteredExcludedMatches, matchingResult, true, userMatch.languageMatch );
							}
						}
						else {
							console.log("normal adding matching but snd");
							addFittingLanguageMatches(actualUserId, filteredExcludedMatches, matchingResult, false );
						}
					}
				});
			});

			console.log("final result");
			console.log(matchingResult);
		});


		return matchingResults;
	},
});


function addFittingLanguageMatches(actualUserId, languageMatches, matchingResult, excludeActual = false, actualLanguageMatchId ){
	let filteredLanguageMatches;
	if (excludeActual){
		filteredLanguageMatches = languageMatches.filter(match => {
			return (!match.hidden) || (match._id === actualLanguageMatchId);
		});
	}
	else {
		filteredLanguageMatches = languageMatches.filter(match => {
			return !match.hidden;
		});
	}

	matchingResult.matches = filteredLanguageMatches.map(function (item) {
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
