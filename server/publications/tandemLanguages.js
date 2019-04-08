import {Meteor} from 'meteor/meteor';
import TandemLanguages from '../models/TandemLanguages'

Meteor.publish({
	'tandemLanguages'() {
		return TandemLanguages.findAll();
	},
});
