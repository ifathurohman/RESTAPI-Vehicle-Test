const mongoose = require('mongoose');

const priceListSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0,
  },
  year_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleYear',
    required: true
  },
  model_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleModel',
    required: true
  }
});

module.exports = mongoose.model('PriceList', priceListSchema);
