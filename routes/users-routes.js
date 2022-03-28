const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

/** 
 * @swagger 
 * /api/users/:
 *   get: 
 *     description: get list of users
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
router.get('/', usersController.getUsers);

/** 
 * @swagger 
 * /api/users/signup:
 *   post:
 *     name: User signup
 *     description: user signup
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             name:
 *               type: string
 *     responses:
 *       201: 
 *         description: Created
 *       422: 
 *         description: Unprocessable Entity
 *       500:
 *         description: Error
 *
 */
router.post(
    '/signup',
    //fileUpload.single('image'),
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail()
            .isEmail(),
        check('password').isLength({ min: 6 })
    ],
    usersController.signup
);

/** 
 * @swagger 
 * /api/users/login:
 *   post:
 *      name: User login
 *      description: user login
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        200: 
 *          description: Success
 *        401: 
 *          description: Unauthorized
 *        500:
 *          description: Error
 *
 */
router.post('/login', usersController.login);

router.use(checkAuth);

/** 
 * @swagger 
 * /api/users/remove/{userId}:
 *   delete:
 *     name: Delete a User
 *     description: delete a user account and all data associate with account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         minimum: 2
 *         description: the user ID
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error
 *
 */
router.delete('/remove/:pid', usersController.deleteUser);

module.exports = router;
