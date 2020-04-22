const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true }
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
