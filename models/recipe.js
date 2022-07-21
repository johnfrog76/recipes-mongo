const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: String,
    user: String,
    userId: String
}, { timestamps: true });

const favoriteSchema = new mongoose.Schema({
    userId: String
}, { timestamps: true });

const recipeSchema = new mongoose.Schema({
    user_id: String,
    r_name: String,
    cat_id: String,
    shared: Boolean,
    rating: Number,
    category: String,
    ingredients: Array,
    steps: Array,
    comments: [commentSchema],
    favorites: [favoriteSchema]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);