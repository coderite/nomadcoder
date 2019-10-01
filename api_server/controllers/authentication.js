const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const debug = require('debug')('auth');
const store = require('store');

const register = (req, res) => {
    const {name, email, username, password} = req.body;

    if(!username || !password || !name || !email) {
        res.status(400).json({'message':'all fields required'});
    }

    let user = new User();
    user.name = name;
    user.email = email;
    user.username = username;
    user.setPassword(password);
    debug('user: ' + user);
    user.save((err) => {
       if(err) {
           res.status(400).json(err);
       } else {
           const token = user.generateJwt();
           res.status(200).json({token});
       }
    });
};

const login = (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        res.status(400).json({'message':'missing credentials'});
    }

    debug(`${username} and ${password}`);
    passport.authenticate('local', (err, user, info) => {
        debug('entering local authenticate fuction');
        let token;
        if(err) {
           return res.status(400).json(err);
       }

       if(user) {
           token = user.generateJwt();
            setToken(token);
           return res.status(200).json({token});
       } else {
           res.status(401).json(info);
       }
    })(req, res);
};

const setToken = (token) => {
    store.set('token', token);
    debug('token set: ' + token);
};

const getToken = () => {
  return store.get('token');
};

module.exports = {
    register,
    login,

};