const debug = require('debug')('app-ctrl-admin');
const settings = require('../config/settings.js');
const request = require('request');

// local helper functions
const getApiServer = () => {
    if(process.env.NODE_ENV === 'production') {
        return process.env.API_SERVER;
    }
    return `${process.env.API_SERVER}:${process.env.PORT}`;
};

const renderPostsPage = (req, res, responseBody) => {
    let message = '';
    if(!(responseBody.posts instanceof Array)) {
        message = 'the API is having issues';
        responseBody = [];
    } else if(responseBody.posts.length < 1) {
        message = 'no posts found! Get blogging!';
    }

    debug('message: ' + message);
    debug('rendering page for ' + req.payload.username);
    debug(responseBody.posts);
    res.render('admin/posts', {
        payload:req.payload,
        settings: settings,
        posts: responseBody.posts,
        message: message
    });
};

// page functions

const getAdminHomePage = (req, res) => {
    debug('getting dashboard ' + req.payload);
    res.render('admin/dashboard', {payload:req.payload, settings:settings});
};

const getPostIndexPage = (req, res) => {
    debug('getting all posts pages');
    const path = '/api/posts?all=true';
    const url = `${getApiServer()}${path}`;

    debug('GETTING api server ' + url);
    const requestOptions = {
        url: url,
        method: "GET",
        json: {},
    };

    request(requestOptions, (err, response, body) => {
        debug('request sent to API: ' + response.statusCode + ' body length: ' + body.postCount);
        renderPostsPage(req, res, body);
    });
};

module.exports = {
    getAdminHomePage,
    getPostIndexPage,
};