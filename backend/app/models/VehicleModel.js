const mongoose = require('mongoose');

const vehicleModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: true
  }
},
  { timestamps: true },
);


module.exports = mongoose.model('VehicleModel', vehicleModelSchema);
