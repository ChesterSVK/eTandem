import {Base} from 'meteor/rocketchat:models';

export class TandemLanguageMatches extends Base {
	constructor() {
		super('tandem_language_matches');

		this.model.before.insert((userId, doc) => {
			doc.hidden = false;
		});

	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Insert

	createSymetricMatchAsStudent(studentId, match, symetricLanguageId) {
		return this.insert(
			{
				symetric: true,
				usersInMatch: [studentId, match.userId],
				languagesInMatch: [match.langId, symetricLanguageId]
			});
	}

	createSymetricMatchAsTeacher(teacherId, match, symetricLanguageId) {
		return this.insert({
			symetric: true,
			usersInMatch: [teacherId, match.userId],
			languagesInMatch: [match.langId, symetricLanguageId]
		});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Custom

	hideMatch(matchId) {
		return this.update({_id: matchId}, {$set: {hidden: true}});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Find

	findMatches(query) {
		return this.find(query);
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Delete

	removeMatchesWhereUser(userId) {
		return this.remove({usersInMatch: userId});
	}
}

export default new TandemLanguageMatches();
