import { Meteor } from 'meteor/meteor';
import TandemUserMatches from '../models/TandemUsersMatches';

Meteor.methods({
	'tandemUserMatches/hasSomeMatches'() {
		if (!this.userId){
			return this.ready();
		}
		return TandemUserMatches.findByUserId(this.userId).fetch().length > 0;
	},

	'tandemUserMatches/getAsTeacher'() {
		if (!this.userId){
			return ready();
		}
		return TandemUserMatches.findAsTeacher(this.userId).fetch();
	},

	'tandemUserMatches/getAsStudent'() {
		if (!this.userId){
			return ready();
		}
		return TandemUserMatches.findAsStudent(this.userId).fetch();
	},
});
