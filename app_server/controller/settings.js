const request = require('request');
const settings = require('../config/settings');
const debug = require('debug')('app-ctrl-settings');
const store = require('store');

// check if its production or not and return the right URI
function getServer() {
    if(process.env.NODE_ENV == 'production') {
        return `${process.env.API_SERVER}`;
    } else {
        return `${process.env.API_SERVER}:${process.env.PORT}`;
    }
}

const getSettings = (req, res) => {
    // request settings from backend
    debug('app requesting settings');
    const url = `${getServer()}/api/settings`;
    debug('URL: ' + url);
    const requestOptions = {
        url:url,
        method:'get',
        json:{}
    };

    request(requestOptions, (err, response, body) => {
        debug(`status code settings page ${response.statusCode}`);
        debug(body);

        // render page with the new settings
        debug('rendering settings page');
        return res.render('admin/settings', {
            payload: req.payload,
            settings: settings,
            data: body,
            error: req.query.err,
            success: req.query.success
        });
    });
};

const updateSettings = (req, res) => {
    // get the submitted variables
    debug('updating settings');
    const {maintenance_mode, google_indexing, author_registration, page_post_limit} = req.body;

    const url = `${getServer()}/api/settings`;
    const settingsData = {
        maintenance_mode,
        google_indexing,
        author_registration,
        page_post_limit
    };
    debug('submitted settings: ' + JSON.stringify(settingsData));
    debug('using url: ' + url);

    const token = store.get('token');
    const requestOptions = {
        url: url,
        method: 'put',
        json: settingsData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    // post it to the api link
    request(requestOptions, (err, response, body) => {
        debug(`status code settings page ${response.statusCode}`);

        if(err || response.statusCode === 400) {
            debug(err);
            return res.redirect('/admin/settings?error=true');
        }

        if(response.statusCode === 401) {
            return res.redirect('/admin/settings?error=auth');
        }

        if(response.statusCode === 201 && body) {
            // render the results
            return res.redirect('/admin/settings?success=true');
        }
    })
};

// middleware for checking that maintenance mode is enabled or disabled
const isMaintenanceMode = (req, res, next) => {
    debug('checking for maintenance mode');

    const url = `${getServer()}/api/settings`;
    debug('using url: ' + url);

    // no need for authorization because middleware is intended for public consumption
    const requestOptions = {
        url: url,
        method: 'get',
        json: {},
    };

    request(requestOptions, (err, response, body) => {
        debug(`status code settings page ${response.statusCode}`);

        if(err || response.statusCode === 400) {
            debug('got an error response from the API: ' + err);
            return next();
        }

        if(response.statusCode === 200 && body) {
            const isMaintenanceMode = body.maintenance_mode;

            if(isMaintenanceMode) {
                debug('maintenance mode has been enabled');
                return res.render('maintenance');
            }
            // next since maintenance mode is not enabled
            debug('maintenance mode is not enabled');
            next();
        }
    });
};

const getRobots = (req, res) => {
    // check if Google indexing has been enabled
    debug('checking for Google Indexing status');

    const url = `${getServer()}/api/settings`;
    debug('using url: ' + url);

    // no need for authorization because middleware is intended for public consumption
    const requestOptions = {
        url: url,
        method: 'get',
        json: {},
    };

    request(requestOptions, (err, response, body) => {
        debug(`status code settings page ${response.statusCode}`);

        if(err || response.statusCode === 400) {
            debug('got an error response from the API: ' + err);
            return res.status(400).json({'message':'something went wrong'});
        }

        if(response.statusCode === 200 && body) {
            const isGoogleIndexing = body.google_indexing;

            if(isGoogleIndexing) {
                debug('Google indexing has been enabled');
                res.type('text/plain');
                return res.status(200).send("User-agent: *\nDisallow: /admin");
            }
            // next since maintenance mode is not enabled
            debug('Google indexing is not enabled');
            res.type('text/plain');
            res.status(200).send("User-agent: *\nDisallow: /");
        }
    });
};

const isRegistrationEnabled = (req, res, next) => {
    debug('checking is registration enabled');

    const url = `${getServer()}/api/settings`;
    debug('using url: ' + url);

    // no need for authorization because middleware is intended for public consumption
    const requestOptions = {
        url: url,
        method: 'get',
        json: {},
    };

    request(requestOptions, (err, response, body) => {
        debug(`status code settings page ${response.statusCode}`);

        if(err || response.statusCode === 400) {
            debug('got an error response from the API: ' + err);
            return next();
        }

        if(response.statusCode === 200 && body) {
            const isRegistrationEnabled = body.author_registration;

            if(isRegistrationEnabled) {
                debug('registration has been enabled');
                return next();
            }
        }
        // next since maintenance mode is not enabled
        debug('registration not enabled');
        res.redirect('/');
    });
};


module.exports = {
  getSettings,
  updateSettings,
  isMaintenanceMode,
  getRobots,
  isRegistrationEnabled
};