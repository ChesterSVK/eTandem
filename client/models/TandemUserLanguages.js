import { Base } from 'meteor/rocketchat:models';

export class TandemUserLanguages extends Base {
	constructor() {
		super();
		this._initModel('tandem_user_languages');
	}

	findLanguagesWithMotivation(motivation) {
		return this.find({motivation: motivation});
	}

}

export default new TandemUserLanguages();
