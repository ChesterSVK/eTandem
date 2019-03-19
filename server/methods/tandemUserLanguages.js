import { Meteor } from 'meteor/meteor';
import TandemUserLanguages  from '../models/TandemUserLanguages';
import { Rooms }  from 'meteor/rocketchat:models';
import {TeachingMotivationEnum} from "../../lib/teachingMotivation";

Meteor.methods({
	'tandemUserLanguages/hasSomePreferences'() {
		if (!this.userId){
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'tandemUserLanguages/hasSomePreferences',
			});
		}
		return TandemUserLanguages.findByUserId(this.userId).fetch().length > 0;
	},

	'tandemUserLanguages/setPreferences'(lanugagePreferences, motivation) {
		if (!this.userId){
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'tandemUserLanguages/setPreferences',
			});
		}
		if (!(motivation === TeachingMotivationEnum.WTLEARN || motivation === TeachingMotivationEnum.WTTEACH)){
			throw new Meteor.Error('error-invalid-motivation', 'Invalid motivation: ' + motivation, {
				method: 'tandemUserLanguages/setPreferences',
			});
		}

		TandemUserLanguages.deleteUserPreferences(Meteor.userId(), motivation);

		let alreadyInserted = [];

		if (lanugagePreferences && Array.isArray(lanugagePreferences)){
			lanugagePreferences.forEach(function (preference) {
				if (alreadyInserted.indexOf(preference.langId) === -1){
					TandemUserLanguages.insertNew(Meteor.userId(), motivation, preference);
					alreadyInserted.push(preference.langId);
				}
			})
		}

		return true;
	},

	'tandemUserLanguages/getPreferences'() {
		if (!this.userId){
			return ready();
		}
		return TandemUserLanguages.findByUserId(this.userId).fetch();
	},
});
