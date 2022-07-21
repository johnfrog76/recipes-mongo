const express = require('express');

const categoriesController = require('../controllers/categories-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/** 
 * @swagger 
 * /api/categories/:
 *   get:
 *     name: List of shared categories
 *     description: List of all shared categories
 *     responses:  
 *       200:
 *         description: Success  
 *       500:
 *         description: Error
 */
router.get('/', categoriesController.getCategories);

router.use(checkAuth);

// auth routes here

module.exports = router;
