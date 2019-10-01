const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

// import controllers
const ctrlInfo = require('../controllers/info');
const ctrlPost = require('../controllers/post');
const ctrlPosts = require('../controllers/posts');
const ctrlAuth = require('../controllers/authentication');
const ctrlSettings = require('../controllers/settings');

// setup jwt
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

// API welcome screen
router
    .route('/')
    .get(ctrlInfo.apiInfo);

// post
router
    .route('/post')
    .post(auth, ctrlPost.createPost);

router
    .route('/post/:stub')
    .get(ctrlPost.getPost)
    .put(auth, ctrlPost.updatePost)
    .delete(auth, ctrlPost.deletePost);

// posts
router
    .route('/posts')
    .get(ctrlPosts.getPostsForHomeList);

router
    .route('/posts/:pageid')
    .get(ctrlPosts.getPostsByPage);

// settings
router
    .route('/settings')
    .get(ctrlSettings.getSettings)
    .put(auth, ctrlSettings.updateSettings);

// maintenance mode
router
    .route('/settings/mmode')
    .get(ctrlSettings.isMaintenanceMode);

// Google indexing
router
    .route('/settings/gindexing')
    .get(ctrlSettings.isGoogleIndexing);


// authentication
router
    .route('/register')
    .post(ctrlAuth.register);

router
    .route('/login')
    .post(ctrlAuth.login);

module.exports = router;
