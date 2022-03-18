require('dotenv').config()

const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const HttpError = require('../models/http-error');

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
    res.json(result);
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

    res.json({ recipe: recipe.toObject({ getters: true }) });
};

const getRecipes = async (req, res, next) => {
    let recipes;

    try {
        // recipes = await Recipe.find({}, ['r_name', 'rating']).exec();
        recipes = await Recipe.find().exec();
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

exports.createRecipe = createRecipe;
exports.getRecipes = getRecipes;
exports.viewRecipe = viewRecipe;
exports.deleteRecipe = deleteRecipe;
exports.updateRecipe = updateRecipe;
exports.updateRecipeComments = updateRecipeComments;