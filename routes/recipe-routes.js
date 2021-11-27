const express = require('express');

const recipesController = require('../controllers/recipes-controller');

const router = express.Router();

router.get('/', recipesController.getRecipes);

router.post('/', recipesController.createRecipe);

router.get('/:pid', recipesController.viewRecipe);

router.delete('/:pid', recipesController.deleteRecipe);

router.patch('/:pid', recipesController.updateRecipe);

module.exports = router;