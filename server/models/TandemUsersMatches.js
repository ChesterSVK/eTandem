import { Base } from 'meteor/rocketchat:models';
import {MatchingRequestStateEnum} from '../../lib/helperData'

export class TandemUsersMatches extends Base {
	constructor() {
		super('tandem_users_matches');

		this.model.before.insert((userId, doc) => {
			doc.unmatched = false;
			doc.status = MatchingRequestStateEnum.PENDING;
			doc.reportedUsers = [];

		});

		this.tryEnsureIndex({
			studentId: 1,
			teacherId: 1,
			languageMatch : 1
		}, {
			unique: 1,
		});

		this.tryEnsureIndex({
			roomId: 1,
		}, {
			unique: 1,
		});
	}


	createUserMatchByLanguageMatch(userId, languageMatch, roomId, matchingLangId, symetricLangId){
		return this.insert({
			languageMatch : languageMatch._id,
			studentId : userId,
			teacherId : languageMatch.teacher._id,
			roomId : roomId,
			matchingLanguage: matchingLangId,
			symetricLanguage: symetricLangId,
		});
	}

	findByUserId(userId) {
		const query = {
			$or: [
				{ studentId: userId },
				{ teacherId: userId },
			],
		};
		return this.find(query);
	}

	findByUserIdAndRoomId(userId, roomId) {
		const query = {
			$or: [
				{ studentId: userId },
				{ teacherId: userId },
			],
			roomId : roomId
		};
		return this.findOne(query);
	}

	reportUserInMatch(fromUserId, matchId, reportedUserId) {
		return this.update({_id: matchId}, {
			$push : {
				reportedUsers: { from : fromUserId , to : reportedUserId }
			}
		});
	}

	unmatchMatch(matchId, state){
		return this.update({_id: matchId}, { $set : { unmatched : state}});
	}

	findWithOptions(options){
		return this.find(options);
	}

	findMatches(userId, unmatched = false){
		return this.find({ $or : [{teacherId: userId}, {studentId: userId}], unmatched: unmatched});
	}

	findOneByRoomId(roomId){
		return this.findOne({roomId: roomId});
	}

	acceptMatchRequest(roomId){
		return this.update({roomId: roomId}, {$set : {status : MatchingRequestStateEnum.ACCEPTED}});
	}

	declineMatchRequest(roomId){
		return this.update({roomId: roomId}, {$set : {status : MatchingRequestStateEnum.DECLINED}});
	}

	findAsTeacher(teacherId, unmatched = false) {
		return this.find({teacherId: teacherId, unmatched: unmatched});
	}

	findAsStudent(studentId, unmatched = false) {
		return this.find({studentId: studentId, unmatched: unmatched});
	}

	removeById(matchId) {
		return this.remove(matchId);
	}
}

export default new TandemUsersMatches();
