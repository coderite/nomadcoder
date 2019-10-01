const passport = require('passport');
const debug = require('debug')('passport');
require('./strategies/local.strategy')();


module.exports = function passportConfig(app) {
    require('./strategies/google.strategy')(app);
    app.use(passport.initialize());
    app.use(passport.session());

    debug('passport initialized');
    debug('session initialized');


    // store a user in the session
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}