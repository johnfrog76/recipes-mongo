const express = require('express');

const recipesController = require('../controllers/recipes-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.get('/', recipesController.getRecipes);

router.get('/:pid', recipesController.viewRecipe);

router.use(checkAuth);

router.post('/', recipesController.createRecipe);

router.delete('/:pid', recipesController.deleteRecipe);

router.patch('/:pid', recipesController.updateRecipe);

router.patch('/comments/:pid', recipesController.updateRecipeComments);

module.exports = router;