const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
    title: String,
    version: String
});

mongoose.model('api', apiSchema);