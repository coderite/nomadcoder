const express = require('express');
const router = express.Router();
const debug = require('debug')('postRoutes');

const ctrlFrontpage = require('../controller/frontpage');
const ctrlSettings = require('../controller/settings');

/*
    FRONT PAGE ROUTING
 */

router
    .route('/aws/upload')
    .all(ctrlSettings.isMaintenanceMode)
    .get((req, res) => {
       res.render('upload');
    });

// setup the main index page
router.route('/')
    // if mmode then render new page ELSE next()
    .all(ctrlSettings.isMaintenanceMode)
    .get(ctrlFrontpage.getFrontPage);

// control for pagination
router.route('/page/:pageNumber')
    .all(ctrlSettings.isMaintenanceMode)
    .get(ctrlFrontpage.getFrontPagePaginate);

// catch any stubs for individual post pages
router
    .route('/:stub')
    .all(ctrlSettings.isMaintenanceMode)
    .get(ctrlFrontpage.getPageFromStub);

module.exports = router;