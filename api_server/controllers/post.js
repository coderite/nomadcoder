const debug = require('debug')('api-ctrl-post');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

const getPost = (req, res) => {
    Post.findOne({stub: req.params.stub}).exec((err, post)  => {
        if(err) {
            return res.status(400).json(err);
        } else if(!post) {
            return res.status(404).json({'message':'post not found'});
        }
        res.status(200).json(post);
    });
};

const getAuthor = (req, res, callback) => {
    debug('getting author');
    if(req.payload && req.payload.username) {
        debug('payload confirmed');
        User.findOne({username:req.payload.username}).exec((err, user) => {
            if(!user){
                return res.status(404).json({"message":"user not found"});
            } else if(err) {
                return res.status(400).json(err);
            }
            debug('calling callback');
            callback(req, res, user.username);
        })
    }
};

const createPost = (req, res) => {
    debug('creating post');
    getAuthor(req, res, (req, res, username) => {
        debug('found username: ' + username);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let post = new Post();
        const {title, stub, description, tags, publish, discourse_id} = req.body;

        post.title = title;
        post.stub = stub;
        post.author = username;
        post.publish = publish;
        post.post_date_short = `${new Date().getDate()} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`;
        post.discourse_intergration = discourse_id;
        post.tags = tags;
        post.description = description;


        Post.create(post, (err, post) => {
            if(err) {
                return res.status(400).json(err);
            } else if(!post) {
                return res.status(404).json('could not create post');
            }
            res.status(203).json(post);
        });
    });
};

const updatePost = (req, res) => {
    Post.findOne({stub:req.params.stub}).exec((err, post) => {
        if(err) {
            return res.status(400).json(err);
        } else if(!post) {
            return res.status(404).json({'message':'post not found'});
        }

        const {title, stub, description, tags, author, publish} = req.body;
        post.title = title;
        post.stub = stub;
        post.description = description;
        post.tags = tags;
        post.author = author;
        post.publish = publish;
        post.modified_date = new Date().getTime();

        post.save((err, post) => {
           if(err) {
               return res.status(400).json(err);
           }
           res.status(201).json(post);
        });
    });
};

const deletePost = (req, res) => {
    Post.findOne({stub:req.params.stub}).exec((err, post) => {
        if(err) {
            return res.status(400).json(err);
        } else if(!post) {
            return res.status(404).json({'message':'post not found'});
        }

        post.remove((err, post) => {
            debug('removing post: ' + req.params.stub);
            if(err) {
                debug('removing post: ERROR');
                return res.status(400).json(err);
            }
            debug('removing post success');
            res.status(204).json({'message':`deleted post ${req.params.stub}`});
        });
    });
};

module.exports = {
    getPost,
    createPost,
    updatePost,
    deletePost
};