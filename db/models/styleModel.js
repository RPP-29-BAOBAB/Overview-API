const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const styleSchema = new Schema({
  id: {type: Number, required: true},
  productId: {type: Number, required: true},
  name: {type: String},
  sale_price: {type: Number, default: null},
  default_style: Number,
  original_price: {type: Number},
  photos: [],
  skus: []
})

const Style = module.exports = mongoose.model('style', styleSchema);