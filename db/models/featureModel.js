const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeatureSchema = new Schema({
  id: { type: Number, required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'product' },
  feature: { type: String, required: true },
  value: { type: String, default: null }
});

const Feature = module.exports = mongoose.model('feature', FeatureSchema);

