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
			roomId: 1,
		}, {
			unique: 1,
		});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Insert
	createUserMatchByLanguageMatch(userId, languageMatch, roomId, matchingLangId, symetricLangId){
		return this.insert({
			requestedBy: userId,
			users : [userId, languageMatch.teacher._id],
			roomId : roomId,
			matchingLanguage: {
				matchingLanguageId : matchingLangId,
				matchingLanguageTeacherId : languageMatch.teacher._id,
			},
			symetricLanguage: {
				symetricLanguageId : symetricLangId,
				symetricLanguageTeacherId : userId
			},
		});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Find
	findByUserId(userId) {
		const query = {
			users : userId,
		};
		return this.find(query);
	}

	findByUserIdAndRoomId(userId, roomId) {
		const query = {
			users : userId,
			roomId : roomId
		};
		return this.findOne(query);
	}

	findWithOptions(options){
		return this.find(options);
	}

	findMatches(userId, unmatched = false){
		return this.find({ users : userId, unmatched: unmatched});
	}

	findOneByRoomId(roomId){
		return this.findOne({roomId: roomId});
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Custom
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

	acceptMatchRequest(roomId){
		return this.update({roomId: roomId}, {$set : {status : MatchingRequestStateEnum.ACCEPTED}});
	}

	declineMatchRequest(roomId){
		return this.update({roomId: roomId}, {$set : {status : MatchingRequestStateEnum.DECLINED}});
	}

	removeById(matchId) {
		return this.remove(matchId);
	}
}

export default new TandemUsersMatches();
