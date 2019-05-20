/* eslint-env mocha */

// import { Tinytest } from "meteor/tinytest";
import { Meteor } from 'meteor/meteor';
import { assert,expect } from 'chai';

// Import and rename a variable exported by test-package.js.


// Write your tests here!
// Here is an example.
// Tinytest.add('test-package - example', function (test) {
//     test.equal("test-package", "test-package");
// });

if (Meteor.isClient) {
    describe('fooClient',
        function (){
            it('must be a stringT',
                function (){
                    expect("string").to.be.a('string');
                });
        });
}