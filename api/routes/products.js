const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

/**
 * The Products Controller for the various routes and their action for the Products
 * @param products_get_all Handles the incoming GET request for all of the products
 * @param products_create_product Handles the incoming POST request for the creation of a new product
 * @param products_get_product Handles the incoming GET request for the single product
 * @param products_update_product Handles the incoming PATCH request for the single product
 * @param products_delete_product Handles the incoming DELETE request for the deletion of a single product
 */
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // reject file
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.route('/').get(ProductController.products_get_all);

router
  .route('/')
  .post(
    checkAuth,
    upload.single('productImage'),
    ProductController.products_create_product
  );

router.route('/:id').get(ProductController.products_get_product);

router
  .route('/:id')
  .patch(checkAuth, ProductController.products_update_product);

router
  .route('/:id')
  .delete(checkAuth, ProductController.products_delete_product);

module.exports = router;
