const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: String,
    user: String,
    userId: String
}, { timestamps: true })

const recipeSchema = new mongoose.Schema({
    user_id: String,
    r_name: String,
    cat_id: Number,
    shared: Boolean,
    rating: Number,
    category: String,
    ingredients: Array,
    steps: Array,
    comments: [commentSchema],
    favorites: [String]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);