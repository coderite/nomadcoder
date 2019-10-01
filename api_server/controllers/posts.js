const mongoose = require('mongoose');
const Posts = mongoose.model('Post');
const debug = require('debug')('api-ctrl-posts');

// exported functions
const getPostsForHomeList = (req, res) => {
    let limit = 3;
    if(req.query.limit) {
        limit = parseInt(req.query.limit);
    }
    let query = {publish:true};
    if(req.query.all == 'true') {
        limit = 0;
        query={};
    }

    Posts.find(query).countDocuments().exec((err, count) => {
        errCheck(res, err, count);

        Posts.find(query).sort({post_date: -1}).limit(limit).exec((err, posts) => {
            errCheck(res, err, posts);

            const data = {
                postCount: count,
                pageNumber: 1,
                posts: posts
            };

            return res.status(200).json(data);
        });
    });
};

const getPostsByPage = (req, res) => {
    const limit = 3; // get this dynamically in future
    const page = parseInt(req.params.pageid);
    const skip = (page - 1) * limit;
    debug('post page: ' + page + ' skip: ' + skip);

    Posts.find({publish:true}).countDocuments().exec((err, count) => {
        errCheck(res, err, count);

        Posts.find({publish:true}).sort({'post_date':-1}).skip(skip).limit(limit).exec((err, posts) => {
            errCheck(res, err, posts);

            const data = {
                postCount: count,
                pageNumber: page,
                posts: posts
            };

            res.status(200).json(data);
        });
    });
};

// helper functions
const errCheck = (res, err, posts) => {
    if(err) {
        return res.status(400).json(err);
    } else if(!posts) {
        return res.status(404).json({'message':'not found'});
    }
};

module.exports = {
    getPostsForHomeList,
    getPostsByPage
};