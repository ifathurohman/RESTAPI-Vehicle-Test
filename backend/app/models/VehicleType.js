const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleBrand',
    required: true
  }
},
  { timestamps: true },
);


module.exports = mongoose.model('VehicleType', vehicleTypeSchema);
