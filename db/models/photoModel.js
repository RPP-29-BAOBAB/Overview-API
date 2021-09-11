const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  id: {type: Number, required: true},
  styleId: {type: Number, required: true},
  url: {type: String, default: null},
  thumbnail_url: {type: String, default: null}
})

const Photo = module.exports = mongoose.model('photo', photoSchema);