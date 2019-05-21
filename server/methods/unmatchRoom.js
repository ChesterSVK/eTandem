import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {hasPermission} from 'meteor/rocketchat:authorization';
import {Roles} from 'meteor/rocketchat:models';
import TandemUsersMatches from '../models/TandemUsersMatches'
import TandemLanguageMatches from '../models/TandemLanguageMatches'
import {TandemFeedbackMails} from "../../lib/feedbackMails";
import {checkCondition, getOtherOne} from "../../lib/checkerHelpers";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Methods

Meteor.methods({
    unmatchRoom(rid, reason) {
        checkInput(rid, reason);
        checkCondition(Meteor.userId(), 'error-invalid-user', 'Invalid user', {method: 'unmatchRoom'});
        checkCondition(hasPermission(Meteor.userId(), 'tandem-unmatch'), 'error-not-allowed', 'Not allowed', {method: 'unmatchRoom'});

        const match = getMatch(rid, Meteor.userId());
        TandemUsersMatches.unmatchMatch(match._id, true);

        sendEmailReport(Meteor.userId(), match, reason);
        Meteor.call('executeLanguageMatching', Meteor.userId(), []);
        return true;
    },
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Private functions

///////////////////////////////////////////////////////////////////////////////////////////////////	Validity functions

/**
 * Straightforward
 */
function checkInput(rid, reason) {
    check(rid, String);
    check(reason, String);
}


///////////////////////////////////////////////////////////////////////////////////////////////////	Getters

/**
 * Get match by roomId and userId
 * @param roomId
 * @param userId
 */
function getMatch(roomId, userId) {
    const match = TandemUsersMatches.findByUserIdAndRoomId(userId, roomId);
    checkCondition(match, 'error-invalid-match', 'Invalid user match', {method: 'unmatchRoom'});
    return match;
}

/**
 * Sends email report with reason of unmatching the user match
 * @param actualUserId that sends the report
 * @param match that is gonna be reported
 * @param reason for unmatching
 */
function sendEmailReport(actualUserId, match, reason) {
    const reportEmailData = {
        userTo: getOtherOne(match.users, actualUserId),
        userFrom: actualUserId,
        reason: reason
    };

    Meteor.call('tandemSendEmail',
        TandemFeedbackMails.types.UNMATCH,
        reportEmailData,
        (error, result) => {
            if (error) {
                checkCondition(error, 'error-sending-email', 'Internal error', {method: 'unmatchRoom'});
            }
        });
}