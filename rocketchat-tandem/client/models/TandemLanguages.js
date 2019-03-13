import { Base } from 'meteor/rocketchat:models';

export class TandemLanguages extends Base {
	constructor() {
		super();
		this._initModel('tandem_languages');
	}
}

export default new TandemLanguages();
