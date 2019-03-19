import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { hasPermission } from 'meteor/rocketchat:authorization';
import { Roles } from 'meteor/rocketchat:models';
import TandemUserMatches from '../models/TandemUsersMatches'

Meteor.methods({
	hasUserStudents() {
		if (!Meteor.userId()) {
			return false;
		}
		const fields = {
			teacherId: 1,
			unmatched: 1
		};
		return TandemUserMatches.findAsTeacher(Meteor.userId(), false).fetch().length > 0;
	},
});
