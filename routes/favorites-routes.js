const express = require('express');

const favoritesController = require('../controllers/favorites-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.use(checkAuth);

router.post('/add', favoritesController.addFavorite);

router.post('/remove', favoritesController.removeFavorite);


module.exports = router;