const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, ref: 'Recipe' },
    id: { type: String, required: true }
})

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    favorites: [favoritesSchema],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);