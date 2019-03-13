import {Meteor} from 'meteor/meteor';
import TandemLanguageLevels from '../models/TandemLanguageLevels'

Meteor.publish({
	'tandemLanguageLevels'() {
		return TandemLanguageLevels.findAll();
	},
});
