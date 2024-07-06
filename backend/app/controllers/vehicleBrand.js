const VehicleBrand = require('../models/VehicleBrand');

const index = async (req, res, next) => {
  try {
    const brands = await VehicleBrand.find();
    res.json(brands);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const normalizedName = name.trim().toLowerCase();
    
    const existingBrand = await VehicleBrand.findOne({ name: normalizedName });

    if (existingBrand) {
      return res.status(400).json({ message: 'Vehicle brand name already exists' });
    }

    const newBrand = new VehicleBrand({ name: normalizedName });
    await newBrand.save();

    res.status(200).json(newBrand);
  } catch (err) {
    next(err); // Pass any errors to the error handling middleware
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedBrand = await VehicleBrand.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(updatedBrand);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBrand = await VehicleBrand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(deletedBrand);
  } catch (err) {
    next(err);
  }
};

const destroyAllData = async (req, res, next) => {
  try {
    let brand = await VehicleBrand.deleteMany();
    return res.json(brand);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
  store,
  update,
  destroy,
  destroyAllData,
};
