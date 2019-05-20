/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';

if (Meteor.isClient) {
    describe('testClient',
        function (){
            it('testingCondition',
                function (){
                    expect(true).to.equal(true);
                });
        });
}