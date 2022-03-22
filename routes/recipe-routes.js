const express = require('express');

const recipesController = require('../controllers/recipes-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/** 
 * @swagger 
 * /api/recipes/unauth/:
 *   get: 
 *     description: get shared recipes collection
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
router.get('/unauth/', recipesController.getRecipes);

router.get('/unauth/:pid', recipesController.viewRecipe);


router.use(checkAuth);

/** 
 * @swagger 
 * /api/recipes/auth:
 *   get:
 *      name: Auth Recipes
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200: 
 *          description: success
 *        401: 
 *          descriptin: permissions
 *
 */
router.get('/auth/', recipesController.getRecipesAuth);

router.post('/', recipesController.createRecipe);

router.delete('/:pid', recipesController.deleteRecipe);

router.patch('/:pid', recipesController.updateRecipe);

router.patch('/comments/:pid', recipesController.updateRecipeComments);

module.exports = router;