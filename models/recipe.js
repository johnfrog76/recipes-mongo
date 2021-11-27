const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    user_id: Number,
    r_name: String,
    cat_id: Number,
    shared: Boolean,
    rating: Number,
    category: String,
    ingredients: Array,
    steps: Array,
    comments: [{
        comment: String,
        user: String
    }]
});

module.exports = mongoose.model('Recipe', recipeSchema);