const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skuSchema = new Schema({
  id: {type: Number, required: true},
  styleId: {type: Number, required: true},
  size: {type: String, required: true},
  quantity: {type: Number, default: 0},
});

const Sku = module.exports = mongoose.model('sku', skuSchema);