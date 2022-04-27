require('dotenv').config()
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const HttpError = require('../models/http-error');


const copyOneRecipe = async (req, res, next) => {
    const { recipeId, userId } = req.body;
    // const authUserId = req.userData.userId;

    let recipe;
    let user;
    let copyComment;
    let createdRecipe;
    let result;

    try {
        recipe = await Recipe.findById(recipeId);
    } catch (err) {
        const error = new HttpError(
            'failed to find recipe to copy',
            500
        );

        return next(error);
    }

    try {
        user = await User.findById(userId)
    } catch (err) {
        const error = new HttpError(
            'failed to find user to own copy',
            500
        );

        return next(error);
    }

    try {
        copyComment = {
            comment: `recipe copied from ${recipe._id} by ${user.name}`,
            id: user._id,
            user: user.name
        }

        createdRecipe = new Recipe({
            user_id: user._id,
            r_name: recipe.r_name + ' (copy)',
            cat_id: recipe.cat_id,
            shared: false,
            rating: recipe.rating,
            category: recipe.category,
            steps: recipe.steps,
            ingredients: recipe.ingredients,
            comments: []
        });

        createdRecipe.comments.push(copyComment);

    } catch (err) {
        const error = new HttpError(
            'failed to create new recipe',
            500
        );

        return next(error);
    }


    try {
        // saving the recipe
        result = await createdRecipe.save();
    } catch (err) {

        const error = new HttpError(
            'failed to save new recipe',
            500
        );

        return next(error);
    }

    res.status(201).json({
        data: result,
        message: 'recipe copy created'
    });
};


const createRecipe = async (req, res, next) => {

    const createdRecipe = new Recipe({
        user_id: req.body.user_id,
        r_name: req.body.r_name,
        cat_id: req.body.cat_id,
        shared: req.body.shared,
        rating: req.body.rating,
        category: req.body.category,
        steps: req.body.steps,
        ingredients: req.body.ingredients,
        comments: req.body.comments
    });

    let result;
    try {
        result = await createdRecipe.save();
    } catch (err) {
        console.log(err)
        const error = new HttpError(
            'failed to create new recipe',
            500
        );
        return next(error);
    }
    res.status(201).json(result);
};

const deleteRecipe = async (req, res, next) => {

    const recipeId = req.params.pid;
    let recipe;
    let authUserId;

    try {
        recipe = await Recipe.findById(recipeId);

        if (req) {
            authUserId = req.userData.userId;
            if (recipe.user_id !== authUserId) {
                throw new Error('Delete failed, id must match creator id.');
            }
        }

    } catch (err) {
        const error = new HttpError(
            err.message,
            500
        );
        return next(error);
    }

    try {

        recipe = await Recipe.findByIdAndRemove(recipeId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete recipe.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted recipe.' });
};

const viewRecipe = async (req, res, next) => {
    const recipeId = req.params.pid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId);
    } catch (err) {

        const error = new HttpError(
            'Something went wrong, could not find this recipe.',
            500
        );
        return next(error);
    }

    if (!recipe) {
        const error = new HttpError(
            'Could not find recipe for the provided id.',
            404
        );
        return next(error);
    }

    if (recipe.shared === false) {
        const error = new HttpError(
            'No permission to view this recipe',
            401
        )
        return next(error);
    }

    res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
};

const getRecipesAuth = async (req, res, next) => {
    const authUserId = req.userData.userId;
    let recipes;

    try {
        recipes = await Recipe.find({ $or: [{ shared: true }, { user_id: authUserId }] }).exec();
    } catch (err) {
        const error = new HttpError(
            'Could not find recipes',
            500
        );
        return next(error);
    }

    res.json(recipes)
}

const getRecipes = async (req, res, next) => {
    let recipes;

    try {
        recipes = await Recipe.find({ shared: true }).exec();
    } catch (err) {
        const error = new HttpError(
            'Could not find recipes',
            500
        );
        return next(error);
    }

    res.json(recipes)
};

const updateRecipe = async (req, res, next) => {
    const { r_name, cat_id, shared, rating, category, ingredients, steps, comments } = req.body;
    const recipeId = req.params.pid;


    let recipe;
    let authUserId;

    try {
        recipe = await Recipe.findById(recipeId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update recipe.',
            500
        );
        return next(error);
    }


    try {
        if (req) {
            authUserId = req.userData.userId;

            if (recipe.user_id !== authUserId) {
                throw new Error('Update failed, id must match creator id.');
            }
        }
    } catch (err) {
        const error = new HttpError(
            err.message,
            500
        );
        return next(error);
    }

    recipe.r_name = r_name;
    recipe.cat_id = cat_id;
    recipe.shared = shared;
    recipe.rating = rating;
    recipe.category = category;
    recipe.ingredients = ingredients;
    recipe.steps = steps;
    recipe.comments = comments;

    try {
        await recipe.save();
    } catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not update recipe.',
            500
        );
        return next(error);
    }

    res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
};

const updateRecipeComments = async (req, res, next) => {
    const { comment, user, userId } = req.body;
    const recipeId = req.params.pid;

    let recipe;
    let userComment = { user, comment, userId };

    try {
        recipe = await Recipe.findById(recipeId);
        recipe.comments.push(userComment);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update recipe comments.',
            500
        );
        return next(error);
    }

    try {
        await recipe.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update recipe.',
            500
        );
        return next(error);
    }

    res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
};

const shareRecipeBulkAdd = async (req, res, next) => {
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
            `Something went wrong, could not find user in bulk add share: ${err.message}`,
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
            `Something went wrong, incorrect list of recipes in bulk add share: ${err.message}`,
            500
        );
        return next(error);
    }

    try {
        foundRecipes = await Recipe.find({ _id: { $in: objIdRecipeList } });
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, could not retrieve recipes in bulk add share: ${err.message}`,
            500
        );
        return next(error);
    }

    const savedItems = async () => {
        return await Promise.all(foundRecipes.map(async (r) => {
            try {
                let isOwner = r.user_id === userId;

                if (!isOwner) {
                    await Promise.reject('not the owner');
                } else {
                    if (r.shared === true) {
                        await Promise.reject('already shared');
                    } else {
                        r.shared = true;
                    }
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
            message: 'recipes are shared',
            data: updatedList.filter(r => r.error === undefined),
            errors: updatedList.filter(r => r.error === true)
        });
    });
};

const shareRecipeBulkRemove = async (req, res, next) => {
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
            `Something went wrong, could not find user in bulk remove share: ${err.message}`,
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
            `Something went wrong, incorrect list of recipes in bulk remove share: ${err.message}`,
            500
        );
        return next(error);
    }

    try {
        foundRecipes = await Recipe.find({ _id: { $in: objIdRecipeList } });
    } catch (err) {
        const error = new HttpError(
            `Something went wrong, could not retrieve recipes in bulk remove share: ${err.message}`,
            500
        );
        return next(error);
    }

    const savedItems = async () => {
        return await Promise.all(foundRecipes.map(async (r) => {
            try {
                let isOwner = r.user_id === userId;

                if (!isOwner) {
                    await Promise.reject('not the owner');
                } else {
                    if (r.shared === false) {
                        await Promise.reject('already not shared');
                    } else {
                        r.shared = false;
                    }
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
            message: 'recipes are no longer shared',
            data: updatedList.filter(r => r.error === undefined),
            errors: updatedList.filter(r => r.error === true)
        });
    });
};

exports.createRecipe = createRecipe;
exports.getRecipes = getRecipes;
exports.getRecipesAuth = getRecipesAuth;
exports.viewRecipe = viewRecipe;
exports.deleteRecipe = deleteRecipe;
exports.updateRecipe = updateRecipe;
exports.updateRecipeComments = updateRecipeComments;
exports.shareRecipeBulkAdd = shareRecipeBulkAdd;
exports.shareRecipeBulkRemove = shareRecipeBulkRemove;
exports.copyOneRecipe = copyOneRecipe;