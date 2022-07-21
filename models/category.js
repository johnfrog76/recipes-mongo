const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    custom: Boolean,
    userId: { type: String, default: null }
});


module.exports = mongoose.model('Category', categorySchema);