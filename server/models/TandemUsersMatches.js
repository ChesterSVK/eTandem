import { Base } from 'meteor/rocketchat:models';

export class TandemUsersMatches extends Base {
	constructor() {
		super('tandem_users_matches');

		this.model.before.insert((userId, doc) => {
			doc.unmatched = false;
			doc.reportedUsers = [];

		});

		this.tryEnsureIndex({
			studentId: 1,
			teacherId: 1,
			langName: 1
		}, {
			unique: 1,
		});

		this.tryEnsureIndex({
			roomId: 1,
		}, {
			unique: 1,
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

	findOneByStudentAndTeacher(studentId, teacherId) {
		return this.findOne({studentId: studentId, teacherId: teacherId});
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
