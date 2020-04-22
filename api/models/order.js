const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

const Orders = mongoose.model('Order', ordersSchema);

module.exports = Orders;
