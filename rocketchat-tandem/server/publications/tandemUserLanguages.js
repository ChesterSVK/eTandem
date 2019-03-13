import {Meteor} from 'meteor/meteor';
import TandemUserLanguages from '../models/TandemUserLanguages'

Meteor.publish({
	'tandemUserLanguages'() {
		if (!this.userId){
			return ready();
		}

		return TandemUserLanguages.findByUserId(this.userId);
	},
});
