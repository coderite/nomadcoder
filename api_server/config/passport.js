const mongoose = require('mongoose');
const User = mongoose.model('User');
const debug = require('debug')('passport');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({}, (username, password, done) => {
    debug('trying to find ' + username);
        User.findOne({username: username}).exec((err, user) => {
            debug('inside findOne');
            if(err) {return done(err)}
            if(!user) {
                return done(null, false, {message:'user not found'});
            }
            debug('checking if ' + password + ' is valid');
            if(!user.validPassword(password)) {
                return done(null, false, {message:'password did not match'});
            }
            debug('login was successful');
            debug(user);
            return done(null, user);
        })
    }
));