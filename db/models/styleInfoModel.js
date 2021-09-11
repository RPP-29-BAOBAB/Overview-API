const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const styleInfoSchema = new Schema({
  id: {type: Number, required: true},
  productId: {type: Number, required: true},
  name: {type: String},
  sale_price: Schema.Types.Mixed,
  original_price: Schema.Types.Mixed,
  photos: [],
  skus: []
});

const StyleInfo = module.exports = mongoose.model('styleInfo', styleInfoSchema);