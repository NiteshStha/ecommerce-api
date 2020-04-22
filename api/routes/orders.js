const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

/**
 * The Orders Controller for the various routes and their action for the Orders
 * @param orders_get_all Handles the incoming GET request for all of the orders
 * @param orders_create_order Handles the incoming POST request for the creation of a new order
 * @param orders_get_order Handles the incoming GET request for the single order
 * @param orders_delete_order Handles the incoming DELETE request for the deletion of a single order
 */
const OrderController = require('../controllers/orders');

router.route('/').get(checkAuth, OrderController.orders_get_all);

router.route('/').post(checkAuth, OrderController.orders_create_order);

router.route('/:id').get(checkAuth, OrderController.orders_get_order);

router.route('/:id').delete(checkAuth, OrderController.orders_delete_order);

module.exports = router;
