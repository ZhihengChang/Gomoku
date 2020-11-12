const mocha = require('../../node_modules/mocha')
const assert = require('assert');
const User = require('./models/user');

//Describe tests
describe('Database tests', function(){
    
    //create tests
    it('Saves a user to db', function(){
        var user = new User({
            user_id: 1000,
            username: 'testPlayer',
            level: 1,
            status: 'online',
        });
        user.save().then(function(done){
            assert(user.isNew === false);
            done();
        });
    });
});