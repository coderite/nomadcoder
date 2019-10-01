const express = require('express');
const router = express.Router();

const routerBackend = require('./backend');
const routerAdmin = require('./admin');
const routerFrontend = require('./frontend');
const routerPortfolio = require('./portfolio');

router.use('/admin', routerAdmin);

// backend router sets up the backend
router.use('/', routerBackend);

// front page sets up the blog frontend
router.use('/blog', routerFrontend);

// front end setup for portfolio
router.use('/', routerPortfolio);

module.exports = router;