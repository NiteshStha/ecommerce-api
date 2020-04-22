const mongoose = require('mongoose');
const Product = require('../models/product');

/**
 * Handles the incoming GET request for all of the products
 */
exports.products_get_all = (req, res, next) => {
  console.log('hello');
  Product.find()
    .select('name price _id productImage')
    .then(result => {
      const response = {
        count: result.length,
        product: result.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: '/products/' + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Handles the incoming POST request for the creation of a new product
 */
exports.products_create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: '/products/' + result._id
          }
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
 * Handles the incoming GET request for the single product
 */
exports.products_get_product = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .select('name price _id productImage')
    .then(result => {
      if (result) {
        res.status(200).json({
          product: result,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/products'
          }
        });
      } else {
        res.status(404).json({
          message: 'No valid entry found for the provided Id'
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

/**
 * Handles the incoming PATCH request for the single product
 */
exports.products_update_product = (req, res, next) => {
  const id = req.params.id;
  // const updat
  Product.updateOne({ _id: id }, { $set: req.body })
    .then(result => {
      res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:5000/products/' + id
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
 * Handles the incoming DELETE request for the single product
 */
exports.products_delete_product = (req, res, next) => {
  const id = req.params.id;
  Product.deleteOne({ _id: id })
    .then(result => {
      res.status(200).json({
        message: 'Product Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:5000/products',
          body: { name: 'String', price: 'Number' }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
