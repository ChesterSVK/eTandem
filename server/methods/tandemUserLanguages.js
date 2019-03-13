import { Meteor } from 'meteor/meteor';
import TandemUserLanguages  from '../models/TandemUserLanguages';
import { Rooms }  from 'meteor/rocketchat:models';

Meteor.methods({
	'tandemUserLanguages/hasSomePreferences'() {
		if (!this.userId){
			return false;
		}
		return TandemUserLanguages.findByUserId(this.userId).fetch().length > 0;
	},

	'tandemUserLanguages/getPreferences'() {
		if (!this.userId){
			return ready();
		}
		return TandemUserLanguages.findByUserId(this.userId).fetch();
	},
});
