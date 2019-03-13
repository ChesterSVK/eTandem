import { Base } from 'meteor/rocketchat:models';

export class TandemUserLanguages extends Base {
	constructor() {
		super("tandem_user_languages");

		this.model.before.insert((userId, doc) => {

		});

		this.tryEnsureIndex({
			userId: 1,
			langName: 1,
			motivation: 1,
		}, {
			unique: 1,
		});
	}


	findByUserId(userId) {
		return this.find({userId: userId});
	}

	// findByUserIdAndLangName(userId, langName) {
	// 	return this.find({userId: userId, langName: langName});
	// }
    //
	// findOneByUserIdLangNameAndMotivation(userId, langName, motivation) {
	// 	return this.findOne({userId: userId, langName: langName, motivation: motivation});
	// }

	findTeachingLanguages(userId, langName, motivation) {
		return this.findOne({userId: userId, langName: langName, motivation: motivation});
	}

	findUserLanguages(userId, motivation) {
		return this.find({userId: userId, motivation: motivation});
	}

	findLanguageMatches(exceptUserId, motivation, langName) {
		return this.find({userId: {$ne: exceptUserId}, motivation: motivation, langName: langName});
	}
}

export default new TandemUserLanguages();
