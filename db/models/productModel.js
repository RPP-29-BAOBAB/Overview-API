const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let productSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  slogan: { type: String },
  description: { type: String },
  category: { type: String },
  default_price: { type: String, required: true },
  features: [],
  styles: []
}, { timestamps: true });

const Product = module.exports = mongoose.model('product', productSchema);