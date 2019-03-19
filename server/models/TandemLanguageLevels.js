import { Base } from 'meteor/rocketchat:models';

export class TandemLanguageLevels extends Base {
	constructor() {
		super('tandem_language_levels');

		this.model.before.insert((userId, doc) => {

		});

		this.tryEnsureIndex({
			level: 1,
		}, {
			unique: 1,
			sparse: 1
		});
	}

	findOneByLangLevel(langLevel) {
		return this.findOne(langLevel);
	}

	findOneById(levelId) {
		return this.findOne({_id: levelId});
	}

	findAll() {
		return this.find({});
	}
}

export default new TandemLanguageLevels();
