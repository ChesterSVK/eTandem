import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { hasPermission } from 'meteor/rocketchat:authorization';
import { Roles } from 'meteor/rocketchat:models';
import TandemUsersMatches from '../models/TandemUsersMatches'
import TandemLanguageMatches from '../models/TandemLanguageMatches'
import {MatchingRequestStateEnum} from "../../lib/helperData";

Meteor.methods({
	unmatchRoom(rid) {
		check(rid, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'unmatchRoom',
			});
		}
		if (!hasPermission(Meteor.userId(), 'tandem-unmatch')) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {
				method: 'unmatchRoom',
			});
		}

		const match = TandemUsersMatches.findByUserIdAndRoomId(Meteor.userId(), rid);

		if (!match){
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'unmatchRoom',
			});
		}

		TandemLanguageMatches.hideMatch(match.languageMatch);
		TandemUsersMatches.unmatchMatch(match._id, true);

		const usersMatches = TandemUsersMatches.findMatches({
			users: Meteor.userId(),
			unmatched: false,
			state: {$in : [MatchingRequestStateEnum.PENDING, MatchingRequestStateEnum.ACCEPTED, MatchingRequestStateEnum.COMPLETED]}
		});
		let userStillTeaches = false;
		let userStillLearns = false;

		usersMatches.forEach(function (userMatch) {
			if (userMatch.matchingLanguage.matchingLanguageTeacherId === Meteor.userId()){
				userStillTeaches = true;
			}
			if (userMatch.symetricLanguage.symetricLanguageTeacherId === Meteor.userId()){
				userStillLearns = true;
			}
		});

		if (!userStillLearns){
			Roles.removeUserRoles(Meteor.userId(), ['tandem-student']);
		}
		if (!userStillTeaches) {
			Roles.removeUserRoles(Meteor.userId(), ['tandem-teacher']);
		}

		Meteor.call('executeLanguageMatching', this.userId, []);
		return true;
	},
});
