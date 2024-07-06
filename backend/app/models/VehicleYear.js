const mongoose = require('mongoose');

const vehicleYearSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  }
},
  { timestamps: true },
);

module.exports = mongoose.model('VehicleYear', vehicleYearSchema);
