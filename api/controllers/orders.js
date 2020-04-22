const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

/**
 * Handles the incoming GET request for all of the orders
 */
exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('productId quantity _id')
    .populate('productId', 'name')
    .then(result => {
      res.status(200).json({
        count: result.length,
        orders: result.map(doc => {
          return {
            _id: doc._id,
            productId: doc.productId,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:5000/orders/' + result._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Handles the incoming POST request for the creation of a new order
 */
exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        productId: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Order Stored',
        createdOrder: {
          _id: result._id,
          quantity: result.quantity,
          productId: result.productId
        },
        request: {
          type: 'GET',
          url: 'http://localhost:5000/orders' + result.id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Handles the incoming GET request for the single order
 */
exports.orders_get_order = (req, res, next) => {
  const id = req.params.id;
  Order.findById(id)
    .select('_id quantity productId')
    .populate('productId')
    .then(order => {
      if (order) {
        res.status(200).json({
          order: order,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/orders'
          }
        });
      } else {
        res.status(404).json({
          message: 'No valid entry found for the provided Id'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Handles the incoming DELETE request for the single order
 */
exports.orders_delete_order = (req, res, next) => {
  const id = req.params.id;
  Order.deleteOne({ _id: id })
    .then(result => {
      res.status(200).json({
        message: 'Order Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:5000/orders',
          body: { quantity: 'Number', productId: 'ID' }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
