import {Meteor} from 'meteor/meteor';
import TandemUsersMatches from '../models/TandemUsersMatches';
import TandemLanguages from '../models/TandemLanguages';
import TandemLanguageMatches from '../models/TandemLanguageMatches';
import {Roles, Rooms, Users} from 'meteor/rocketchat:models';
import {check} from 'meteor/check';
import {MatchingRequestStateEnum} from "../../lib/helperData";


function getSymetricLang(langs, matchingLang){
	console.log(langs);
	if (langs.length === 2){
		if (langs[0] === matchingLang){
			return langs[1];
		}
		if (langs[1] === matchingLang){
			return langs[0];
		}
	}
	return false;
}

Meteor.methods({
	'tandemUserMatches/hasSomeMatches'() {
		if (!this.userId) {
			return this.ready();
		}
		return TandemUsersMatches.findByUserId(this.userId).fetch().length > 0;
	},

	'tandemUserMatches/getAsTeacher'() {
		if (!this.userId) {
			return ready();
		}
		return TandemUsersMatches.findAsTeacher(this.userId).fetch();
	},

	'tandemUserMatches/getAsStudent'() {
		if (!this.userId) {
			return ready();
		}
		return TandemUsersMatches.findAsStudent(this.userId).fetch();
	},

	'tandemUserMatches/getMatchingRequest'(roomId) {
		if (!this.userId) {
			return false;
		}
		if (!roomId) {
			return false;
		}
		check(roomId, String);

		const room = Rooms.findOneById(roomId);
		if (room == null) {
			throw new Meteor.Error('error-invalid-room', 'Invalid room', {
				method: 'tandemUserMatches/showTeacherRequest',
			});
		}

		const userMatch = TandemUsersMatches.findOneByRoomId(roomId);
		if (userMatch == null) {
			throw new Meteor.Error('error-invalid-match', 'Invalid match', {
				method: 'tandemUserMatches/showTeacherRequest',
			});
		}

		return userMatch;
	},

	'tandemUserMatches/acceptTeacherRequest'(roomId) {
		if (!this.userId) {
			return false;
		}
		if (!roomId) {
			return false;
		}
		check(roomId, String);

		TandemUsersMatches.acceptMatchRequest(roomId);

		Meteor.call('reloadLanguageMatching', {});
		return true;
	},

	'tandemUserMatches/declineTeacherRequest'(roomId) {
		if (!this.userId) {
			return false;
		}
		if (!roomId) {
			return false;
		}
		check(roomId, String);

		TandemUsersMatches.declineMatchRequest(roomId);
		return true;
	},


	'tandemUserMatches/createMatchingRequest'(match, roomId) {
		if (!this.userId) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {method: 'tandemUserMatches/createMatchingRequest'});
		}
		if (match === undefined || typeof match !== 'object') {
			throw new Meteor.Error('error-invalid-match', 'Invalid match', {method: 'tandemUserMatches/createMatchingRequest'});
		}
		if (roomId === undefined) {
			throw new Meteor.Error('error-invalid-match', 'Invalid match', {method: 'tandemUserMatches/createMatchingRequest'});
		}

		TandemLanguageMatches.hideMatch(match._id);

		Roles.addUserRoles(this.userId, ['tandem-student'], {});
		Roles.addUserRoles(match.teacher._id, ['tandem-teacher'], {});

		const matchingLangId = TandemLanguages.findOneByLangName(match.matchingLanguage)._id;
		const symetricLangId = TandemLanguages.findOneByLangName(getSymetricLang(match.languagesInMatch, match.matchingLanguage))._id;

		return TandemUsersMatches.createUserMatchByLanguageMatch(this.userId, match, roomId, matchingLangId, symetricLangId);
	},

	'tandemUserMatches/transform' (matches) {
		if (!this.userId) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {method: 'tandemUserMatches/createMatchingRequest'});
		}
		if (matches === undefined || !Array.isArray(matches)) {
			throw new Meteor.Error('error-invalid-match', 'Invalid match', {method: 'tandemUserMatches/createMatchingRequest'});
		}

		return matches.map(function (match) {
			return {
				status: match.status,
				unmatched: match.unmatched,
				symetricLanguage : match.symetricLanguage ? TandemLanguages.findOneById(match.symetricLanguage).name : "",
				matchingLanguage : TandemLanguages.findOneById(match.matchingLanguage).name,
				roomName : Rooms.findOneByIdOrName(match.roomId).name,
				student : Users.findOneById(match.studentId),
				teacher : Users.findOneById(match.teacherId),
			};
		});
	},

	'tandemUserMatches/getAllMatches'() {
		if (!this.userId){
			return ready();
		}

		const query = {
			$or: [
				{ studentId: this.userId },
				{ teacherId: this.userId },
			],
			status: {
				$in: [MatchingRequestStateEnum.ACCEPTED, MatchingRequestStateEnum.COMPLETED, MatchingRequestStateEnum.PENDING]
			},
			unmatched: false,
		};

		return TandemUsersMatches.findWithOptions(query);
	},
});
