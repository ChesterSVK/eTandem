import { Base } from 'meteor/rocketchat:models';

export class TandemUsersMatches extends Base {
	constructor() {
		super('tandem_users_matches');

		this.model.before.insert((userId, doc) => {
			doc.unmatched = false;

		});

		this.tryEnsureIndex({
			studentId: 1,
			teacherId: 1
		}, {
			unique: 1,
		});

		this.tryEnsureIndex({
			roomId: 1
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

	findOneByStudentAndTeacher(studentId, teacherId) {
		return this.findOne({studentId: studentId, teacherId: teacherId});
	}

	findAsTeacher(teacherId) {
		return this.find({teacherId: teacherId});
	}

	findAsStudent(studentId) {
		return this.find({studentId: studentId});
	}


	removeById(matchId) {
		return this.remove(matchId);
	}
}

export default new TandemUsersMatches();
