const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('localStrategy');
const { MongoClient } = require('mongodb');

debug('local strategy module');

module.exports = function localStrategy() {
    passport.use(new Strategy({
            usernameField: "username",
            passwordField: "password"
        }, (username, password, done) => {

            let URL = 'mongodb://localhost:27017';
            let dbName = 'libraryApp';

            (async function validate(){
                let client;
                try {
                    client = await MongoClient.connect(URL, {useNewUrlParser: true});
                    debug('connected to Mongo');
                    const db = client.db(dbName);
                    const col = db.collection('users');
                    const user = await col.findOne({username: username});

                    debug(user);

                    if(password != null && user.password === password) {
                        done(null, {user});
                    } else {
                        done(null, false);
                    }
                } catch(err) {
                    debug(err);
                } finally {
                    client.close();
                }
            }());
        }
    ));
    debug('local strategy loaded');
}