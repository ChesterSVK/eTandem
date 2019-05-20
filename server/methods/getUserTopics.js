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
    getUserTopics(userId) {
        return [];
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

/**
 * Straightforward
 */
function checkUser(id) {
    checkCondition(id, 'error-invalid-user', 'Invalid user', {method: 'unmatchRoom'});

    if (!hasPermission(id, 'tandem-unmatch')) {
        throw new Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'unmatchRoom',
        });
    }
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
                throw new Meteor.Error('error-sending-email', 'Internal error', {
                    method: 'unmatchRoom',
                });
            }
        });
}