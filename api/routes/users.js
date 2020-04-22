const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

require('dotenv').config();

/**
 * The Users Controller for the various routes and their action for the Orders
 * @param users_sign_up_user Handles the incoming POST request for the creation of a new user/signup
 * @param users_login_user Handles the incoming POST request for the login of the user
 * @param users_delete_user Handles the incoming DELETE request for the deletion of a single user
 */
const UsersController = require('../controllers/users');

router.route('/signup').post(UsersController.users_sign_up_user);

router.route('/login').post(UsersController.users_login_user);

router.route('/:id').delete(checkAuth, UsersController.users_delete_user);

module.exports = router;
