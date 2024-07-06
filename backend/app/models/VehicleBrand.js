const mongoose = require('mongoose');

const vehicleBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
},
  { timestamps: true },
);

module.exports = mongoose.model('VehicleBrand', vehicleBrandSchema);
