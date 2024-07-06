const VehicleType = require('../models/VehicleType');
const VehicleBrand = require('../models/VehicleBrand');

// GET all vehicle types
const index = async (req, res, next) => {
  try {
    const types = await VehicleType.find();
    res.json(types);
  } catch (err) {
    next(err);
  }
};

// GET one vehicle type by ID
const show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const type = await VehicleType.findById(id).populate('brand_id');

    if (!type) {
      return res.status(404).json({ message: 'Vehicle type not found' });
    }

    res.json(type);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let vehicleType = new VehicleType(payload);

    const existingVehicleType = await VehicleType.findOne({
      name: payload.name,
      brand_id: payload.brand_id
    });
    if (existingVehicleType) {
      return res.status(400).json({
        status: false,
        message: 'Vehicle type with this name and brand already exists',
      });
    }
    const brand = await VehicleBrand.findById(payload.brand_id);
    if (!brand) {
      return res.status(404).json({
        status: false,
        message: 'Vehicle brand not found',
      })
    }

    await vehicleType.save();
    return res.json({
      status: true,
      message: 'Vehicle type successfully added',
      data: {
        type: vehicleType,
        brand: brand
      },
    })
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, brand_id } = req.body;

    const brand = await VehicleBrand.findById(brand_id);
    if (!brand) {
      return res.status(404).json({ message: 'Vehicle brand not found' });
    }

    const updatedType = await VehicleType.findByIdAndUpdate(
      id,
      { name, brand_id },
      { new: true }
    );

    if (!updatedType) {
      return res.status(404).json({ message: 'Vehicle type not found' });
    }

    res.json(updatedType);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedType = await VehicleType.findByIdAndDelete(id);

    if (!deletedType) {
      return res.status(404).json({ message: 'Vehicle type not found' });
    }

    res.json(deletedType);
  } catch (err) {
    next(err);
  }
};

const destroyAllData = async (req, res, next) => {
  try {
    let type = await VehicleType.deleteMany();
    return res.json(type);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  destroyAllData
};
