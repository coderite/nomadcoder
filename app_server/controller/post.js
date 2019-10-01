const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const settings = require('../config/settings.js');
const request = require('request');
const debug = require('debug')('app-ctrl-post');
const store = require('store');

const getApiServer = () => {
    if(process.env.NODE_ENV === 'production') {
        return process.env.API_SERVER;
    }
    return `${process.env.API_SERVER}:${process.env.PORT}`;
};

const getPost = (req, res) => {
    debug('entering a getPost page');
    if(!req.params.stub) {
        res.render('admin/post', {
            payload: req.payload,
            settings: settings,
            error: req.query.err,
            post:null
        });
    } else {
        debug('found a stub: ' + req.params.stub);
        const url = `${getApiServer()}/api/post/${req.params.stub}`;
        debug(`get post ${url}`);
        const requestOptions = {
            url: url,
            method: 'get',
        };

        request(requestOptions, (err, response, body) => {
            if (response.statusCode === 200 && body) {
                const postObj = JSON.parse(body);
                debug(`publish type (${postObj.publish}):  + ${typeof postObj.publish}`);

                debug(`rendering post ${postObj.stub}`);
                return res.render('admin/post', {
                    payload: req.payload,
                    settings: settings,
                    post: postObj,
                    error: req.query.err,
                    success: req.query.success
                });
            }
        });
    }
};

const postPost = (req, res) => {
    const {title, stub, description, tags, author, publish} = req.body;

    if(title.length < 1 || stub.length < 1 || description.length < 1) {
        return res.redirect('/admin/post?err=val');
    }
    const post = {
        title: title,
        stub: stub,
        description: description,
        tags: tags,
        author: author,
        publish: (publish == 'true'),
    };
    debug('post for posting ' + post);

    const token = store.get('token');
    const url = `${getApiServer()}/api/post`;
    debug('using URL: ' + url);

    const requestOptions = {
        url:url,
        method:'post',
        json:post,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    debug('sending request');
    request(requestOptions, (err, response, body) => {
        debug('request sent - got status code ' + response.statusCode);
       if(response.statusCode === 203) {
           debug('status code: ' + response.statusCode);
           return res.redirect(`/admin/post/${post.stub}?success=true`);
       }
    });
};

const updatePost = (req, res) => {
    debug('updating post');
    const {title, stub, description, tags, author, publish} = req.body;

    const post = {
        title: title,
        stub: stub,
        description: description,
        tags: tags,
        author: author,
        publish: (publish == 'true'),
        modified_date: new Date().getTime()
    };

    debug(post);
    debug(`publish type (${post.publish}):  + ${typeof post.publish}`);

    const token = store.get('token');
    const url = `${getApiServer()}/api/post/${req.params.stub}`;
    debug(`set requestOptions URL to ${url}`);
    const requestOptions = {
        url: url,
        method: 'put',
        json: post,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    request(requestOptions, (err, response, body) => {
        debug(`status code ${response.statusCode}`);
        debug(`body ${body}`);
        const {name} = body;
        if(response.statusCode === 400 && name && name === 'ValidationError') {
            debug('validation error');
            return res.redirect(`/admin/post/${req.params.stub}?err=val`);
        }

        if(response.statusCode === 201) {
            debug('entering 201 code');
            debug(`redirecting to post /admin/post/${req.params.stub}`);
            // return res.render('admin/post', {data: req.user, settings: settings, post: postObj, error:req.query.err});
            return res.redirect(`/admin/post/${req.params.stub}?success=true`)
        }
    });
};

const deletePost = (req, res) => {
    const token = store.get('token');
    const url = `${getApiServer()}/api/post/${req.params.stub}`;
    debug(`set requestOptions URL to ${url}`);

    const requestOptions = {
        url: url,
        method: 'delete',
        json: {},
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    request(requestOptions, (err, response, body) => {

    });
    Post.findById(req.params.postid).exec((err, post) => {
        if(err) {
            return res.status(400).json(err);
        }

        post.remove((err, post) => {
            if(err) {
                return res.status(400).json(err);
            }
            res.redirect('/admin/posts');
        });
    });
};


module.exports = {
    getPost,
    postPost,
    updatePost,
    deletePost
};