require('dotenv').config()
const { ObjectId } = require('mongodb');
const Recipe = require('../models/recipe');
const HttpError = require('../models/http-error');

const addFavorite = async (req, res, next) => {
    const { userId, recipeId } = req.body;
    const loggedInUser = req.userData.userId;

    let recipe;

    try {
        recipe = await Recipe.findById(recipeId);

        if (loggedInUser !== userId) {
            throw new Error('user not match auth user');
        }

        let idx = recipe.favorites.findIndex(r => r.userId === userId);

        if (idx === -1) {
            recipe.favorites.push({ userId: userId });
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

    res.status(200).json({
        message: 'favorite added',
        data: recipe
    });
};

const removeFavorite = async (req, res, next) => {
    const { userId, recipeId } = req.body;
    const loggedInUser = req.userData.userId;

    let recipe;

    try {
        recipe = await Recipe.findById(recipeId);

        if (loggedInUser !== userId) {
            throw new Error('user not match auth user');
        }

        let idx = recipe.favorites.findIndex(r => r.userId === userId);

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

    res.status(200).json({
        message: 'favorite removed',
        data: recipe
    });
};

const addFavoriteBulk = async (req, res, next) => {
    let foundRecipes;
    let objIdRecipeList;
    const { userId, recipesList } = req.body;
    const loggedInUser = req.userData.userId;

    try {
        if (loggedInUser !== userId) {
            throw new Error('user not match auth user');
        }
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, could not find user in bulk add favorites: ${err.message}`,
            500
        );
        return next(error);
    }

    try {
        objIdRecipeList = recipesList.map(r => {
            const _id = ObjectId(r);
            return _id;
        });
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, incorrect list of recipes in add favorites: ${err.message}`,
            500
        );
        return next(error);
    }

    try {
        foundRecipes = await Recipe.find({ _id: { $in: objIdRecipeList } });
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, could not retrieve recipes in bulk add favorites: ${err.message}`,
            500
        );
        return next(error);
    }

    const savedItems = async () => {
        return await Promise.all(foundRecipes.map(async (r) => {
            try {
                let idx = r.favorites.findIndex(x => x.userId === userId);

                if (idx === -1) {
                    r.favorites.push({ userId: userId });
                } else {
                    await Promise.reject('already favorited')
                }

                const updated = await r.save();
                return updated;
            } catch (err) {

                if (typeof err === 'string') {
                    return { error: true, message: err }
                }
                return { error: true, message: 'unknown error' }
            }
        }));
    }

    savedItems().then((updatedList) => {
        res.status(200).json({
            message: 'bulk favorites added',
            data: updatedList.filter(r => r.error === undefined),
            errors: updatedList.filter(r => r.error === true)
        });
    });
};

const removeFavoriteBulk = async (req, res, next) => {
    let foundRecipes;
    let objIdRecipeList;
    const { userId, recipesList } = req.body;
    const loggedInUser = req.userData.userId;

    try {
        if (loggedInUser !== userId) {
            throw new Error('user not match auth user');
        }
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, could not find user in bulk remove favorites: ${err.message}`,
            500
        );
        return next(error);
    }

    try {
        objIdRecipeList = recipesList.map(r => {
            const _id = ObjectId(r);
            return _id;
        });
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, incorrect list of recipes in remove favorites: ${err.message}`,
            500
        );
        return next(error);
    }

    try {
        foundRecipes = await Recipe.find({ _id: { $in: objIdRecipeList } });
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, could not retrieve recipes in bulk remove favorites: ${err.message}`,
            500
        );
        return next(error);
    }

    const savedItems = async () => {
        return await Promise.all(foundRecipes.map(async (r) => {
            try {
                let idx = r.favorites.findIndex(x => x.userId === userId);

                if (idx === -1) {
                    await Promise.reject('not found')
                } else {
                    r.favorites.splice(idx, 1);
                }

                const updated = await r.save();
                return updated;
            } catch (err) {

                if (typeof err === 'string') {
                    return { error: true, message: err }
                }
                return { error: true, message: 'unknown error' }
            }
        }));
    }

    savedItems().then((updatedList) => {
        res.status(200).json({
            message: 'bulk favorites removed',
            data: updatedList.filter(r => r.error === undefined),
            errors: updatedList.filter(r => r.error === true)
        });
    });
};

exports.removeFavoriteBulk = removeFavoriteBulk;
exports.addFavoriteBulk = addFavoriteBulk;
exports.addFavorite = addFavorite;
exports.removeFavorite = removeFavorite;
