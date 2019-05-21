import {Meteor} from 'meteor/meteor';
import TandemLanguages from '../models/TandemLanguages'

/*
	Publication of all languages available in the preferences list, which client scripts can subscribe to.
*/
Meteor.publish({
	'tandemLanguages'() {
		return TandemLanguages.findAll();
	},
});
