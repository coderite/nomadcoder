const express = require('express');
const router = express.Router();

const routerBackend = require('./backend');
const routerAdmin = require('./admin');
const routerFrontend = require('./frontend');
const routerPortfolio = require('./portfolio');
const ctrlSettings = require('../controller/settings');

router.use('/admin', routerAdmin);

// backend router sets up the backend
router.use('/', routerBackend);

// front page sets up the blog frontend
router.use('/blog', routerFrontend);

// front end setup for portfolio
router.use('/', routerPortfolio);

// setup the robots.txt file
router.use('/robots.txt', ctrlSettings.getRobots);

// catch all 404 errors
router.get('*', function (req, res) {
  res.send(
    `<h1>404</h1><p>Oh lawdy, you broke teh interwebz!</p><p>Or the page you are trying to visit has been transported to another dimension.</p>`
  );
});

module.exports = router;
