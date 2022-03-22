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

router.post('/login', usersController.login);

router.use(checkAuth);

router.delete('/remove/:pid', usersController.deleteUser);

module.exports = router;
