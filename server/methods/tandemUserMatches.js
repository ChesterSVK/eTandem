import {Meteor} from 'meteor/meteor';
import TandemUsersMatches from '../models/TandemUsersMatches';
import TandemLanguages from '../models/TandemLanguages';
import TandemLanguageMatches from '../models/TandemLanguageMatches';
import {Roles, Rooms, Users, Messages} from 'meteor/rocketchat:models';
import {check} from 'meteor/check';
import { t } from 'meteor/rocketchat:utils';
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

	'tandemUserMatches/getMatchingRequest'(roomId) {
		if (!this.userId) {
			return false;
		}
		if (roomId == null || roomId === undefined) {
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

		Messages.createWithTypeRoomIdMessageAndUser(undefined, roomId, t("get_request_welcome_message", { lang1: match.matchingLanguage, lang2: match.languagesInMatch[0] === match.matchingLanguage ? match.languagesInMatch[1] : match.languagesInMatch[0] }), Meteor.user(), {});

		TandemLanguageMatches.hideMatch(match._id);

		Roles.addUserRoles(this.userId, ['tandem-student'], {});
		Roles.addUserRoles(match.teacher._id, ['tandem-teacher'], {});

		const matchingLangId = TandemLanguages.findOneByLangName(match.matchingLanguage)._id;
		const symetricLangId = TandemLanguages.findOneByLangName(getSymetricLang(match.languagesInMatch, match.matchingLanguage))._id;

		TandemUsersMatches.createUserMatchByLanguageMatch(this.userId, match, roomId, matchingLangId, symetricLangId);
		return Rooms.findOneByIdOrName(roomId);
	},

	'tandemUserMatches/transform' (matches) {
		if (!this.userId) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {method: 'tandemUserMatches/createMatchingRequest'});
		}
		if (matches === undefined || !Array.isArray(matches)) {
			throw new Meteor.Error('error-invalid-match', 'Invalid match', {method: 'tandemUserMatches/createMatchingRequest'});
		}

		return matches.map(function (match) {
			return getMatchObject(match);
		});
	},

	'tandemUserMatches/getAllMatches'() {
		if (!this.userId){
			return ready();
		}

		const query = {
			users: this.userId,
			status: {
				$in: [MatchingRequestStateEnum.ACCEPTED, MatchingRequestStateEnum.COMPLETED, MatchingRequestStateEnum.PENDING]
			},
			unmatched: false,
		};

		return TandemUsersMatches.findWithOptions(query).fetch();
	},
});


function getMatchObject(match) {
	return {
		status: match.status,
		unmatched: match.unmatched,
		roomName : Rooms.findOneByIdOrName(match.roomId).name,
		matchingLanguage : TandemLanguages.findOneById(match.matchingLanguage.matchingLanguageId).name,
		symetricLanguage : TandemLanguages.findOneById(match.symetricLanguage.symetricLanguageId).name,
		matchingLanguageTeacher : Users.findOneById(match.matchingLanguage.matchingLanguageTeacherId),
		symetricLanguageTeacher : Users.findOneById(match.symetricLanguage.symetricLanguageTeacherId),
	};
}
