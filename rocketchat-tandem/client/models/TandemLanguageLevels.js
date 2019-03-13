import { Base } from 'meteor/rocketchat:models';

export class TandemLanguageLevels extends Base {
	constructor() {
		super();
		this._initModel('tandem_language_levels');
	}
}

export default new TandemLanguageLevels();
