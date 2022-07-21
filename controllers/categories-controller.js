require('dotenv').config()
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Category = require('../models/category');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const getCategories = async (req, res, next) => {
    let categories;

    try {
        categories = await Category.find().exec();
    } catch (err) {
        const error = new HttpError(
            'Could not find categories',
            500
        );
        return next(error);
    }

    res.json(categories)
};

exports.getCategories = getCategories;