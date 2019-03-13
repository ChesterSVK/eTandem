import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { hasPermission } from 'meteor/rocketchat:authorization';
import { Roles } from 'meteor/rocketchat:models';
import TandemUserMatches from '../models/TandemUsersMatches'

Meteor.methods({
	unmatchRoom(rid) {
		check(rid, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'eraseRoom',
			});
		}
		// const teachingMatchesCount = TandemUserMatches.findAsTeacher(Meteor.userId().count());
		// if (!teachingMatchesCount === 0) {
		// 	Roles.removeUserRoles(Meteor.userId(), ['tandem-teacher']);
		// }
        //
		// const learningMatchesCount = TandemUserMatches.findAsStudent(Meteor.userId().count());
		// if (!learningMatchesCount === 0){
		// 	Roles.removeUserRoles(Meteor.userId(), ['tandem-student']);
		// }
        //
		// return TandemUserMatches.removeById(match._id);
		return true;
	},
});
