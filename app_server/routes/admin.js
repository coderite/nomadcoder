const express = require('express');
const router = express.Router();

const ctrlPost = require('../controller/post');
const ctrlAuthentication = require('../controller/authentication');
const ctrlAdmin = require('../controller/admin');
const ctrlSettings = require('../controller/settings');

/*
    ADMIN AREA ROUTES
 */


router.route('/posts')
    .all(ctrlAuthentication.isLoggedIn)
    .get(ctrlAdmin.getPostIndexPage);

router.route('/post/:stub')
    .all(ctrlAuthentication.isLoggedIn)
    .get(ctrlPost.getPost)
    .delete(ctrlPost.deletePost);

router.route('/update/:stub')
    .post(ctrlPost.updatePost);

router.route('/delete/:postid')
    .get(ctrlPost.deletePost);

// page for creating blog posts
router.route('/post')
    .all(ctrlAuthentication.isLoggedIn)
    .get(ctrlPost.getPost)
    .post(ctrlPost.postPost);

// get the settings page
router.route('/settings')
    .all(ctrlAuthentication.isLoggedIn)
    .get(ctrlSettings.getSettings)
    .post(ctrlSettings.updateSettings);

// get the home page for the admin (the dashboard page)
router.route('/*')
    .all(ctrlAuthentication.isLoggedIn)
    .get(ctrlAdmin.getAdminHomePage);

module.exports = router;