const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
   maintenance_mode: {
       type: Boolean,
       required:true,
       default: false
   },
    google_indexing: {
       type: Boolean,
        required: true,
        default: true
    },
    author_registration: {
       type: Boolean,
        required: true,
        default: false
    },
    page_post_limit: {
       type: Number,
        required: false,
        default: 3
    }
});

mongoose.model('Settings', settingsSchema);