import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {hasPermission} from 'meteor/rocketchat:authorization';
import {Roles} from 'meteor/rocketchat:models';
import { getUserPreference } from 'meteor/rocketchat:utils';

Meteor.methods({
	reloadLanguageMatching(preferences) {

		if (!Meteor.userId()){
			return false;
		}

		const keys = {
			tandemExcludeFromMatching : Match.Optional(Boolean),
			tandemAllowMultipleTeachings: Match.Optional(Boolean),
		};

		check(preferences, Match.ObjectIncluding(keys));

		const originalPreferences = {
			excluded: getUserPreference(Meteor.user(), 'tandemExcludeFromMatching'),
			allowMultipleTeachings: getUserPreference(Meteor.user(), 'tandemAllowMultipleTeachings'),
		};

		let changed = false;
		if ((preferences.tandemExcludeFromMatching !== originalPreferences.excluded) ||
			(preferences.tandemAllowMultipleTeachings !== originalPreferences.allowMultipleTeachings)
		) changed = true;

		if (changed){
			Meteor.call('saveUserPreferences', preferences);
			Meteor.call('executeLanguageMatching', Meteor.userId(), []);
		}

		return true;
	},
});
