import {Base} from 'meteor/rocketchat:models';

export class TandemUserLanguages extends Base {
	constructor() {
		super("tandem_user_languages");

		this.model.before.insert((userId, doc) => {
		});

		this.tryEnsureIndex({
			userId: 1,
			langId: 1,
			motivation: 1,
		}, {
			unique: 1,
		});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Insert

	insertNew(userId, motivation, preference) {
		return this.insert({
			userId: userId,
			motivation: motivation,
			levelId: preference.levelId,
			langId: preference.langId,
			credits: preference.credits
		})
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Find

	findByUserId(userId) {
		return this.find({userId: userId});
	}

	findUserLanguages(userId, motivation) {
		return this.find({userId: userId, motivation: motivation});
	}

	findLanguageMatches(exceptUserId, motivation, langId, levelIds) {
		return this.find({
			userId: {$ne: exceptUserId},
			motivation: motivation,
			langId: langId,
			levelId: {$in: levelIds}
		});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Delete

	deleteUserPreferences(userId, motivation) {
		return this.remove({userId: userId, motivation: motivation});
	}
}

export default new TandemUserLanguages();
