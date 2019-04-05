import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { hasPermission } from 'meteor/rocketchat:authorization';
import { Roles } from 'meteor/rocketchat:models';
import TandemUserMatches from '../models/TandemUsersMatches'

Meteor.methods({
	hasUserMatches() {
		if (!Meteor.userId()) {
			return false;
		}
		return TandemUserMatches.findMatches(Meteor.userId(), false).fetch().length > 0;
	},
});
