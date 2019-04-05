import { Base } from 'meteor/rocketchat:models';

export class TandemLanguageMatches extends Base {
	constructor() {
		super('tandem_language_matches');

		this.model.before.insert((userId, doc) => {
			doc.hidden = false;
		});

	}

	createAsymetricMatchAsStudent(studentId, match){
		return this.insert({symetricLangLevels: false, symetric : false, usersInMatch: [studentId, match.userId], languagesInMatch: [match.langId]});
	}

	createAsymetricMatchAsTeacher(teacherId, match){
		return this.insert({symetricLangLevels: false, symetric : false, usersInMatch: [teacherId, match.userId], languagesInMatch: [match.langId]});
	}

	createSymetricMatchAsStudent(studentId, match, symetricLanguageId, symetricLangLevels){
 		return this.insert({symetricLangLevels: symetricLangLevels, symetric : true, usersInMatch: [studentId, match.userId], languagesInMatch: [match.langId, symetricLanguageId]});
	}

	createSymetricMatchAsTeacher(teacherId, match, symetricLanguageId, symetricLangLevels){
		return this.insert({symetricLangLevels: symetricLangLevels, symetric : true,  usersInMatch: [teacherId, match.userId], languagesInMatch: [match.langId, symetricLanguageId]});
	}

	hideMatch(matchId){
		return this.update({_id: matchId}, {$set: {hidden: true}});
	}

	findMatches(query){
		return this.find(query);
	}

	removeMatchesWhereUser(userId){
		return this.remove({usersInMatch : userId});
	}
}

export default new TandemLanguageMatches();
