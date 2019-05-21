import {Meteor} from 'meteor/meteor';
import TandemUserLanguages from '../models/TandemUserLanguages'

/*
	Publication of all languages that user has set as his preference, which client scripts can subscribe to.
*/
Meteor.publish({
	'tandemUserLanguages'() {
		if (!this.userId){
			return ready();
		}

		return TandemUserLanguages.findByUserId(this.userId);
	},
});
