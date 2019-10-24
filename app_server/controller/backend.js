const debug = require('debug')('backend:controller');
const passport = require('passport');
const settings = require('../config/settings.js');
const request = require('request');
const config = require('../../config.json');
const ctrlAutherization = require('./authentication');
const mailer = require('nodemailer');

exports.message = (req, res) => {
    const {name, email, subject, budget, message} = req.body;
    let transporter = getTransporter();
    let htmlMessage = message.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
    htmlMessage = htmlMessage.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");

    let mailOptions = {
        from: 'hello@nomadcoder.io',
        to: process.env.DEFAULT_EMAIL,
        subject: 'nomad coder form submission',
        html: `<b>submitted by</b> ${name}<br>
<b>origin</b> ${email}<br>
<b>subject</b> ${subject}<br>
<b>budget</b> ${budget}<br>
<hr>
<h3>message</h3>
<p>${htmlMessage}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('shitcakes ' + error);
            return;
        }
        debug('message has been sent');
        debug('sending welcome message');
        sendWelcomeMessage(req.body);
    });
    res.status(200).json({'message':'message received'});
};

function getTransporter() {
    return mailer.createTransport({
        host: process.env.MAIL_SMTP,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls: {
            ciphers:'SSLv3'
        }
    });
}

function sendWelcomeMessage(formData) {
    const {name, email, subject, budget, message} = formData;

    let transporter = getTransporter();
    let mailOptions = {
        from: 'hello@nomadcoder.io',
        to: email,
        subject: 'I got your message!',
        html: `Hi ${name},<br>
<br> 
thank you for reaching out to me.<br>
<br>        
Herewith a little automated message, but I promise to personally respond to you as soon as possible.<br>
<br>
<br>        
Be well,<br><br>
<strong>Lucas Sadilek</strong><br>
<a href="https://nomadcoder.io">Nomadcoder.io</a>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            debug(error);
        } else {
            debug(`welcome email sent to ${name} @ ${email}`);
        }
    });

}

exports.registerUser = (req, res) => {
    // initialize and assign variables
    const { username, password } = req.body;

    // register a user by inserting them into the database
    if (req.app.locals.db !== 'undefined') {
        const user = {username, password};
        const collection = req.app.locals.db.collection('users');
        collection.insertOne(user)
            .then(response => {
                debug(response);

                req.login(user, () => {
                    res.redirect('/admin');
                })
            })
            .catch(err => {
                debug(err);
                res.send(err);
            });
    }
};

exports.getSignUpPage = (req, res) => {
    res.render('signup');
};


// for passport authentication
exports.authenticate =
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/signin'
        });


// middleware to see if user was authenticated
exports.isAuthenticated = (req, res, next) => {
    debug('checking authentication');
    if (req.user) {
        console.log('user is: ' + JSON.stringify(req.user));
        next();
    } else {
        res.redirect('/signin');
    }
};



exports.getNewPostDash = (req, res) => {
    let post;
    res.render('admin/post', {data: req.user, settings: settings, post});
}

exports.editPost = (req, res) => {
    const postId = req.query.v;

    if(req.app.locals.db !== null) {
        const collection = req.app.locals.db.collection('posts');
        const id = require('mongodb').ObjectId(postId);
        const postPromise = collection.findOne({_id: id});
        postPromise
            .then(post => {
                debug(post);
                res.render('admin/post', {data: req.user, settings: settings, post: JSON.parse(post)});
            })
            .catch(err => res.send(err));
    }
}

exports.updateBlogPost = (req, res) => {
    const { id, title, stub, description, publish } = req.body;
    debug('updating post: ' + id);

    if(req.app.locals.db !== null) {
        const collection = req.app.locals.db.collection('posts');
        const objId = require('mongodb').ObjectId(id);
        const updatePromise = collection.updateOne({_id: objId}, {$set: {title: title, stub: stub, description: description, publish: publish, modified_date: new Date()}});

        updatePromise
            .then(() => {
                debug('post updated');
                res.redirect('/admin/posts');
            })
            .catch(err => res.send(err));
    }
};

exports.deleteBlogPost = (req, res) => {
    const { v } = req.query;
    const id = v;
    debug('deleting post: ' + v);

    if (req.app.locals.db !== null) {
        const collection = req.app.locals.db.collection('posts');
        const objId = require('mongodb').ObjectId(id);
        const postPromise = collection.deleteOne({_id: objId});
        postPromise
            .then(result => {
                debug(result)
                res.redirect('/admin/posts');
            })
            .catch(err => res.send(err));
    }
}


exports.createBlogPost = (req, res) => {
    const {title, description, stub, publish } = req.body;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date();
    const shortDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
    const post = {
        "title": title,
        "description": description,
        "stub": stub,
        "post_date": date,
        "post_date_short": shortDate,
        "discourse_integration": "",
        "publish": publish
    };

    if(req.app.locals.db !== 'undefined') {
        const collection = req.app.locals.db.collection('posts');
        collection.insertOne(post)
            .then(result => {
                debug(result);
                res.json(post);
            })
            .catch(err => {
                debug(err);
                res.send(err);
            })
    } else {
        res.send('oopsie');
    }
};

exports.googleAuthenticate = passport.authenticate('google', {
                                scope: ['https://www.googleapis.com/auth/userinfo.profile']
                             })

exports.googleAuthenticateCallback =
    passport.authenticate('google', {failureRedirect:'/signin'}, (req, res) => {
        res.redirect('/admin');
    });
