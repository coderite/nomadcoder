const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    stub: {
        type: String,
        required: true
    },
    author: String,
    post_date: {
        type: Date,
        default: Date
    },
    post_date_short: String,
    modified_date: {
        type: Date,
        default: Date
    },
    discourse_integration: String,
    publish: {
        type: Boolean,
        default: false
    },
    tags: [String],
    description: {
        type:String,
        required: true
    }
});

mongoose.model('Post', postSchema, 'posts');