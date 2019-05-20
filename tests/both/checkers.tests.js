/* eslint-env mocha */


import {Meteor} from 'meteor/meteor';
import {assert, expect} from 'chai';
import {checkCondition, checkMotivation, getOtherOne, negateMotivation} from "../../lib/checkerHelpers";
import {TeachingMotivationEnum} from "../../lib/helperData";

describe('Check functions',
    () => {
        describe('negateMotivation',
            function () {
                it('return negated motivation',
                    () => {
                        expect(negateMotivation(TeachingMotivationEnum.WTLEARN)).to.equal(TeachingMotivationEnum.WTTEACH);
                        expect(negateMotivation(TeachingMotivationEnum.WTTEACH)).to.equal(TeachingMotivationEnum.WTLEARN);
                    });
                it('negate invalid motivation',
                    () => {
                        expect(() => negateMotivation("lack of motivation")).to.throw(Meteor.Error);
                    });
            });
        describe('getOtherOne',
            function () {
                it('return other',
                    () => {
                        expect(getOtherOne(['this', 'that'], 'this')).to.equal('that');
                    });
                it('invalid array length',
                    () => {
                        expect(getOtherOne(['this'], 'this')).to.equal(false);
                    });
            });
        describe('checkMotivation',
            function () {
                it('valid motivation',
                    () => {
                        expect(() => checkMotivation(TeachingMotivationEnum.WTLEARN)).to.not.throw();
                        expect(() => checkMotivation(TeachingMotivationEnum.WTTEACH)).to.not.throw();
                    });
                it('invalid motivation',
                    () => {
                        expect(() => checkMotivation("lack of motivation")).to.throw();
                    });
            });
        describe('checkCondition',
            function () {
                it('valid condition',
                    () => {
                        expect(() => checkCondition(true)).to.not.throw();
                    });
                it('invalid condition',
                    () => {
                        expect(() => checkCondition(false)).to.throw();
                    });
            });
    });