const passport = require('passport');
const debug = require('debug')('google:auth');
const { OAuth2Strategy } = require('passport-google-oauth');

debug('google strategy module');

module.exports = function googleStrategy(app) {
    passport.use(new OAuth2Strategy(
        {
            clientID: '732267320809-0ff9odao2sug32p3daojm8le0ip8u9a8.apps.googleusercontent.com',
            clientSecret: 'hmn0KcmmN3LCHooxYkYWRZkV',
            callbackURL: "http://localhost:3000/auth/gplus/callback"
        },

        (token, tokenSecret, profile, done) => {
            if(app.locals.db !== null) {
                // connect to the database
                const collection = app.locals.db.collection('users');

                // see if the user exists IF NOT exist then create user
                // use the Google ID to see if they exist
                const user = collection.findOne({googleID: profile.id});
                user.then(user => {
                    // return if user exists
                    if(user !== null) {
                        debug('user in database');
                        debug('user: ' + JSON.stringify(user));
                        return done(null, {profile, token, user});
                    }
                }).catch((err) => {
                        debug(err);
                        debug('user not found so registering user');

                        // register if user does not exist
                        if(user === null) {
                            const user = {
                                googleID: profile.id,
                                username: profile._json.given_name
                            };

                            const results = collection.insertOne(user);
                            results
                                .then(() => {
                                    return done(null, {profile, token, user});
                                })
                                .catch(err => {
                                    debug(err);
                                    return done(err, false);
                                });
                        }
                    }
                );
            }
        }
    ))
};