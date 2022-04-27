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

/** 
 * @swagger 
 * /api/recipes/unauth/{recipeId}:
 *   get:
 *     name: View shared recipe details
 *     description: View shared recipe details
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         type: string
 *         minimum: 2
 *         description: the recipe ID
 *     responses:
 *       200:
 *         description: Success  
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error
 */
router.get('/unauth/:pid', recipesController.viewRecipe);


router.use(checkAuth);

/** 
 * @swagger 
 * /api/recipes/copy-one/:
 *   post:
 *      name: Copy One Recipes
 *      description: copy a new recipe
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              recipeId:
 *                type: string
 *      responses:
 *        201: 
 *          description: Created
 *        401: 
 *          description: Unauthorized
 *
 */
router.post('/copy-one/', recipesController.copyOneRecipe);

/** 
 * @swagger 
 * /api/recipes/auth:
 *   get:
 *      name: Auth Recipes
 *      description: auth collection of recipes
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200: 
 *          description: Success
 *        401: 
 *          description: Unauthorized
 *
 */
router.get('/auth/', recipesController.getRecipesAuth);

/** 
 * @swagger 
 * /api/recipes/:
 *   post:
 *      name: Add New Recipe
 *      description: add a new recipe
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              createdAt:
 *                type: string
 *              updatedAt:
 *                type: string
 *              user_id:
 *                type: string
 *              r_name:
 *                type: string
 *              cat_id:
 *                type: number
 *              shared:
 *                type: boolean
 *              rating:
 *                type: number
 *              category:
 *                type: string
 *              steps:
 *                type: array
 *                items:
 *                  type: string
 *              ingredients:
 *                type: array
 *                items:
 *                  type: string
 *              comments:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    comment:
 *                      type: string
 *                    user:
 *                      type: string
 *                    userId:
 *                      type: string
 *                    createdAt:
 *                      type: string
 *                    updatedAt:
 *                      type: string
 *              favorites:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                    _id:
 *                      type: string
 *                    createdAt:
 *                      type: string
 *                    updatedAt:
 *                      type: string
 *      responses:
 *        200: 
 *          description: Success
 *        401: 
 *          description: Unauthorized
 *
 */
router.post('/', recipesController.createRecipe);

/** 
 * @swagger 
 * /api/recipes/{recipeId}:
 *   delete:
 *     name: Delete a Recipes
 *     description: delete a recipe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         type: string
 *         minimum: 2
 *         description: the recipe ID
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error
 *
 */
router.delete('/:pid', recipesController.deleteRecipe);

/** 
 * @swagger 
 * /api/recipes/{recipeId}:
 *   patch:
 *     name: Update a recipe
 *     description: update a recipe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         type: string
 *         minimum: 2
 *         description: the recipe ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *             user_id:
 *               type: string
 *             r_name:
 *               type: string
 *             cat_id:
 *               type: number
 *             shared:
 *               type: boolean
 *             rating:
 *               type: number
 *             category:
 *                type: string
 *             steps:
 *               type: array
 *               items:
 *                 type: string
 *             ingredients:
 *               type: array
 *               items:
 *                 type: string
 *             comments:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   comment:
 *                     type: string
 *                   user:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *             favorites:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error
 *
 */
router.patch('/:pid', recipesController.updateRecipe);

router.patch('/comments/:pid', recipesController.updateRecipeComments);

/** 
 * @swagger 
 * /api/recipes/share/bulk-add:
 *   patch:
 *      name: Share a list of recipes
 *      description: share a list of recipes
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              recipesList:
 *                type: array
 *                items:
 *                  type: string
 *      responses:
 *        200: 
 *          description: Success
 *        401: 
 *          description: Unauthorized
 *        500:
 *          description: Error
 */
router.patch('/share/bulk-add', recipesController.shareRecipeBulkAdd);

/** 
 * @swagger 
 * /api/recipes/share/bulk-remove:
 *   patch:
 *      name: Remove sharing from list of recipes
 *      description: remove sharing from list of recipes
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              recipesList:
 *                type: array
 *                items:
 *                  type: string
 *      responses:
 *        200: 
 *          description: Success
 *        401: 
 *          description: Unauthorized
 *        500:
 *          description: Error
 */
router.patch('/share/bulk-remove', recipesController.shareRecipeBulkRemove);

module.exports = router;