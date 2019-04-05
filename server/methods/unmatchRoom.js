import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { hasPermission } from 'meteor/rocketchat:authorization';
import { Roles } from 'meteor/rocketchat:models';
import TandemUserMatches from '../models/TandemUsersMatches'
import TandemLanguageMatches from '../models/TandemLanguageMatches'

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

		const match = TandemUserMatches.findByUserIdAndRoomId(Meteor.userId(), rid);

		if (!match){
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'unmatchRoom',
			});
		}

		TandemLanguageMatches.hideMatch(match.languageMatch);

		TandemUserMatches.unmatchMatch(match._id, true);

		const optionsS = {
			unmatched : false,
			studentId : Meteor.userId(),
		};
		const matchesAsStudent = TandemUserMatches.findWithOptions(optionsS);

		const optionsT = {
			unmatched : false,
			teacherId : Meteor.userId(),
		};

		const matchesAsTeacher = TandemUserMatches.findWithOptions(optionsT);

		if (!matchesAsStudent.count() === 0){
			Roles.removeUserRoles(Meteor.userId(), ['tandem-student']);
		}

		if (!matchesAsTeacher.count() === 0) {
			Roles.removeUserRoles(Meteor.userId(), ['tandem-teacher']);
		}

		return true;
	},
});
