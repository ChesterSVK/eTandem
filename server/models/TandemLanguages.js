import { Base } from 'meteor/rocketchat:models';

export class TandemLanguages extends Base {
	constructor() {
		super('tandem_languages');

		this.model.before.insert((userId, doc) => {

		});

		this.tryEnsureIndex({
			langCode: 1,
		}, {
			unique: 1,
			sparse: 1
		});

		this.tryEnsureIndex({
			langName: 1,
		}, {
			unique: 1,
			sparse: 1
		});

		this.tryEnsureIndex({
			langCode: 1,
			langName: 1,
		}, {
			unique: 1,
			sparse: 1
		});
	}

	findOneByLangCode(langCode) {
		return this.findOne(langCode);
	}

	findOneByLangCodeAndName(langCode, langName) {
		return this.findOne({langCode:langCode, langName: langName});
	}

	findOneByLangName(langName) {
		return this.findOne(langName);
	}

	findOneById(langId) {
		return this.findOne({_id: langId});
	}

	findAll() {
		return this._db.find({});
	}
}

export default new TandemLanguages();
