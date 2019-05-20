/* eslint-env mocha */


import {Meteor} from 'meteor/meteor';
import {assert, expect} from 'chai';
import {
    getLevelsAsArray,
    LanguageLevelsEnum,
    MatchingRequestStateEnum,
    TeachingMotivationEnum
} from "../../lib/helperData";

describe('Helpers',
    () => {
        describe('Teaching motivation enum',
            function () {
                it('must be object',
                    () => {
                        expect(TeachingMotivationEnum).to.be.a('object');
                    });
                it('keys must be length of 2',
                    () => {
                        assert.equal(Object.keys(TeachingMotivationEnum).length, 2);
                    });
                it('values must be length of 2',
                    () => {
                        assert.equal(Object.values(TeachingMotivationEnum).length, 2);
                    });
                it('values must be not empty',
                    () => {
                        Object.values(TeachingMotivationEnum).forEach(function (value) {
                            expect(value).to.not.have.lengthOf(0, 'motivation value empty');
                        });
                    });
            });

        describe('Matching request state enum',
            function () {
                it('must be object',
                    () => {
                        expect(MatchingRequestStateEnum).to.be.a('object');
                    });
                it('keys must be length of 4',
                    () => {
                        assert.equal(Object.keys(MatchingRequestStateEnum).length, 4);
                    });
                it('values must be length of 4',
                    () => {
                        assert.equal(Object.values(MatchingRequestStateEnum).length, 4);
                    });
                it('values must be not empty',
                    () => {
                        Object.values(MatchingRequestStateEnum).forEach(function (value) {
                            expect(value).to.not.have.lengthOf(0, 'request value empty');
                        });
                    });
            });


        describe('Language levels enum',
            function () {
                it('must be object',
                    () => {
                        expect(LanguageLevelsEnum).to.be.a('object');
                    });
                it('keys must be length of 6',
                    () => {
                        assert.equal(Object.keys(LanguageLevelsEnum).length, 6);
                    });
                it('values must be length of 6',
                    () => {
                        assert.equal(Object.values(LanguageLevelsEnum).length, 6);
                    });
                it('values must be not empty',
                    () => {
                        Object.values(LanguageLevelsEnum).forEach(function (value) {
                            expect(value).to.not.have.lengthOf(0, 'level value empty');
                        });
                    });
            });

        describe('GetLevelsAsArray',
            function () {
                it('must be array',
                    () => {
                        expect(getLevelsAsArray()).to.be.a('array');
                    });
                it('result must be length of 6',
                    () => {
                        assert.equal(getLevelsAsArray().length, 6);
                    });
                it('result properties are valid',
                    () => {
                        const levels = getLevelsAsArray();
                        levels.forEach(function (level) {
                            expect(level).to.have.property('_id');
                            expect(level).to.have.property('level');
                        })
                    });
                it('result values are valid',
                    () => {
                        const levels = getLevelsAsArray();
                        levels.forEach(function (level) {
                            expect(level._id).to.not.be.a('null');
                            expect(level._id).to.not.have.lengthOf(0, 'level id was empty');
                            expect(level.level).to.not.be.a('null');
                            expect(level.level).to.not.have.lengthOf(0, 'level value was empty');
                        })
                    });
            });
    });