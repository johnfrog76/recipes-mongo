const express = require('express');

const favoritesController = require('../controllers/favorites-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.use(checkAuth);

/** 
 * @swagger 
 * /api/favorites/add:
 *   post:
 *      name: Favorite a recipe
 *      description: favorite a recipe
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
 *        200:
 *          description: Success
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Error
 */
router.post('/add', favoritesController.addFavorite);

/** 
 * @swagger 
 * /api/favorites/remove:
 *   post:
 *      name: Unfavorite a recipe
 *      description: unfavorite a recipe
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
 *        200: 
 *          description: Success
 *        401: 
 *          description: Unauthorized
 *        500:
 *          description: Error
 */
router.post('/remove', favoritesController.removeFavorite);

/** 
 * @swagger 
 * /api/favorites/bulk-add:
 *   post:
 *      name: Add favorites to list of recipes
 *      description: favorite a list of recipes
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
router.post('/bulk-add', favoritesController.addFavoriteBulk);

/** 
 * @swagger 
 * /api/favorites/bulk-remove:
 *   post:
 *      name: Remove favorites to list of recipes
 *      description: remove favorites from list of recipes
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
router.post('/bulk-remove', favoritesController.removeFavoriteBulk);


module.exports = router;