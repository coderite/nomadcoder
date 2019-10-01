const express = require('express');
const debug = require('debug')('backend:router');
const passport = require('passport');
const router = express.Router();
const aws = require('aws-sdk');

const backendController = require('../controller/backend');
const ctrlPost = require('../controller/post');
const ctrlAuthentication = require('../controller/authentication');
const ctrlAdmin = require('../controller/admin');
const ctrlSettings = require('../controller/settings');


/* ***************************** /
*   ROUTES FOR AUTHENTICATION
******************************* */
router.route('/signup')
    .all(ctrlSettings.isRegistrationEnabled)
    // sign up GET
    .get(backendController.getSignUpPage)
    // sign up POST
    .post(backendController.registerUser);

router.route('/login')
    // sign in GET
    .get(ctrlAuthentication.getLoginPage)
    // sign in POST
    .post(ctrlAuthentication.login);

router.route('/logout')
    .get(ctrlAuthentication.logout);

/*
    GOOGLE OATH2.0 ROUTES
 */
router.route('/auth/google')
    .get(backendController.googleAuthenticate);

router.route('/auth/gplus/callback')
    .get(
        passport.authenticate('google', {failureRedirect:'/signin'}), (req, res) => {
            res.redirect('/admin');
        }
    );

// bucket uploads
router.route('/sign-s3')
    .get((req, res) => {
        const s3 = new aws.S3();
        console.log('wowowowowowowowowow');

           const fileName = req.query['file-name'];
           const fileType = req.query['file-type'];
           console.log(fileName);
           const s3Params = {
               Bucket: process.env.AWS_S3_BUCKET,
               Key: fileName,
               Expires: 60,
               ContentType: fileType,
               ACL: 'public-read'
           };
           console.log(s3Params);

       s3.getSignedUrl('putObject', s3Params, (err, data) => {
           if(err) {
               console.log(err);
               return res.send();
           }
           const returnData = {
               signedRequest: data,
               url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`
           };
           res.write(JSON.stringify(returnData));
           res.end();
       })
    });

router
    .route('/blog/aws/save')
    .get((req, res) => {
        res.send('sent');
    });

router
    .route('/message')
    .post(backendController.message);

module.exports = router;