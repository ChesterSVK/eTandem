import {Meteor} from 'meteor/meteor';
import {hasPermission} from 'meteor/rocketchat:authorization';
import {Roles} from 'meteor/rocketchat:models';
import {checkCondition} from "../../lib/checkerHelpers";
import {getUserPreference} from 'meteor/rocketchat:utils';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Methods

Meteor.methods({
    getUserTopics(userId) {
        checkCondition(userId, 'error-invalid-user', 'Invalid user', {method: 'getUserTopics'});
        const topics = getUserPreference(Meteor.user(), 'userTopics');
        return topics === undefined ? [] : topics;
    },
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	Private functions