import { Base } from 'meteor/rocketchat:models';

export class TandemLanguageLevels extends Base {
	constructor() {
		super();
		this._initModel('tandem_language_levels');
	}

	findById(levelId) {
		return this.findOne({_id: levelId});
	}

	findAll() {
		return this.find({});
	}
}

export default new TandemLanguageLevels();
