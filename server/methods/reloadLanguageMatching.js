import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {hasPermission} from 'meteor/rocketchat:authorization';
import {Roles} from 'meteor/rocketchat:models';
import { getUserPreference } from 'meteor/rocketchat:utils';
import {TeachingMotivationEnum} from "../../lib/helperData";
import TandemUserLanguages from "../models/TandemUserLanguages";


Meteor.methods({
	reloadLanguageMatching(preferences) {

		if (!Meteor.userId()){
			return false;
		}

		const keys = {
			tandemExcludeFromMatching : Match.Optional(Boolean),
			tandemSymetricMatching: Match.Optional(Boolean),
			tandemSymetricLanguageLevels: Match.Optional(Boolean),
			// tandemAllowMultipleTeachings: Match.Optional(Boolean),
		};

		check(preferences, Match.ObjectIncluding(keys));

		const originalPreferences = {
			excluded: getUserPreference(Meteor.user(), 'tandemExcludeFromMatching'),
			symetricMatching: getUserPreference(Meteor.user(), 'tandemSymetricMatching'),
			symetricLangs: getUserPreference(Meteor.user(), 'tandemSymetricLanguageLevels'),
			// allowMultipleTeachings: getUserPreference(Meteor.user(), 'tandemAllowMultipleTeachings'),
		};

		if (preferences.tandemSymetricMatching === false){
			preferences.tandemSymetricLanguageLevels = true;
		}

		let changed = false;
		if ((preferences.tandemExcludeFromMatching !== originalPreferences.excluded) ||
			(preferences.tandemSymetricLanguageLevels !== originalPreferences.symetricLangs) ||
			(preferences.tandemSymetricMatching !== originalPreferences.symetricMatching)
			// (preferences.tandemAllowMultipleTeachings !== originalPreferences.allowMultipleTeachings)
		) changed = true;

		if (changed){
			Meteor.call('saveUserPreferences', preferences);

			const teachingPreferences = TandemUserLanguages.findUserLanguages(Meteor.userId(), TeachingMotivationEnum.WTTEACH).fetch();
			const learningPreferences = TandemUserLanguages.findUserLanguages(Meteor.userId(), TeachingMotivationEnum.WTLEARN).fetch();


			Meteor.call('executeLanguageMatching', Meteor.userId(), teachingPreferences);
			Meteor.call('executeLanguageMatching', Meteor.userId(), learningPreferences);
		}

		return true;
	},
});
