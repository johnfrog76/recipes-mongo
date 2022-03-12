require('dotenv').config()

const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const addFavorite = async (req, res, next) => {
    const { userId, recipeId } = req.body;

    let user;
    let recipe;

    try {
        recipe = await Recipe.findById(recipeId);
        user = await User.findById(userId);

        let idx = recipe.favorites.findIndex(r => r === userId);
        if (idx === -1) {
            recipe.favorites.push(userId);
        } else {
            throw new Error('already exists');
        }
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, could not add favorite: ${err.message}`,
            500
        );
        return next(error);
    }

    try {
        await recipe.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Something went wrong, could not save add favorite',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'favorite added' });
}

const removeFavorite = async (req, res, next) => {
    const { userId, recipeId } = req.body;
    let user;
    let recipe;

    try {
        recipe = await Recipe.findById(recipeId);
        user = await User.findById(userId);

        let idx = recipe.favorites.findIndex(r => r === userId);

        if (idx === -1) {
            throw new Error('not found');
        } else {
            recipe.favorites.splice(idx, 1);
        }

    } catch (err) {
        const error = new HttpError(
            `Something went wrong, could not remove favorite: ${err.message}`,
            500
        );
        return next(error);
    }

    try {
        await recipe.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save remove favorite.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'favorite removed' });
}

exports.addFavorite = addFavorite;
exports.removeFavorite = removeFavorite;
