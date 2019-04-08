import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { Rooms, Subscriptions, Users, Messages } from 'meteor/rocketchat:models';
import { hasPermission } from 'meteor/rocketchat:authorization';
import TandemUsersMatches from '../models/TandemUsersMatches';
import * as Mailer from 'meteor/rocketchat:mailer';

Meteor.methods({
	reportUserInRoom(data) {
		check(data, Match.ObjectIncluding({
			rid: String,
			username: String,
		}));

		if (!data.reason){
			throw new Meteor.Error('error-invalid-reason', 'Reason not provided', {
				method: 'reportUserInRoom',
			});
		}
		check(data.reason, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'reportUserInRoom',
			});
		}

		const fromId = Meteor.userId();

		if (!hasPermission(fromId, 'tandem-report-user', data.rid)) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', {
				method: 'reportUserInRoom',
			});
		}

		const room = Rooms.findOneById(data.rid);

		if (!room) {
			throw new Meteor.Error('error-invalid-room', 'Invalid room', {
				method: 'reportUserInRoom',
			});
		}

		if (['c', 'p', 'd'].includes(room.t) === false) {
			throw new Meteor.Error('error-invalid-room-type', `${ room.t } is not a valid room type`, {
				method: 'reportUserInRoom',
				type: room.t,
			});
		}

		const subscription = Subscriptions.findOneByRoomIdAndUsername(data.rid, data.username, { fields: { _id: 1 } });
		if (!subscription) {
			throw new Meteor.Error('error-user-not-in-room', 'User is not in this room', {
				method: 'reportUserInRoom',
			});
		}

		const reportedUser = Users.findOneByUsername(data.username);
		const admins = Users.findUsersInRoles(['admin']).fetch();

		const match = TandemUsersMatches.findByUserIdAndRoomId(Meteor.userId(), data.rid);

		if (!match){
			throw new Meteor.Error('error-invalid-match', 'Invalid match', {
				method: 'reportUserInRoom',
			});
		}

		if (!match.reportedUsers){
			TandemUsersMatches.reportUserInMatch(Meteor.userId(), match._id, reportedUser._id);
		}

		else if (Array.isArray(match.reportedUsers)){
			match.reportedUsers.forEach(function (report) {
				if (report.from === Meteor.userId() && report.to === reportedUser._id){
					throw new Meteor.Error('error-already-reported', 'Already Reported', {
						method: 'reportUserInRoom',
					});
				}
			});

			TandemUsersMatches.reportUserInMatch(Meteor.userId(), match._id, reportedUser._id);
		}

		admins.map(function (admin) {
			// const email = admin.emails[0].address;
			const email = 'jozefcibik@gmail.com';
			console.log(`Sending email to ${email}`);
			const subject = 'Report on user: ' + reportedUser.username;
			const from = Meteor.user().name;
			return Mailer.send({
				to: email,
				from,
				subject,
				reason,
			});
		});

		return true;
	},
});
