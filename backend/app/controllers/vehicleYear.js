const VehicleYear = require('../models/VehicleYear');

// GET all vehicle years
const index = async (req, res, next) => {
    try {
        const years = await VehicleYear.find();
        res.json(years);
    } catch (err) {
        next(err);
    }
};

// GET one vehicle year by ID
const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const year = await VehicleYear.findById(id);

        if (!year) {
            return res.status(404).json({ message: 'Vehicle year not found' });
        }

        res.json(year);
    } catch (err) {
        next(err);
    }
};

// Create a new vehicle year
const store = async (req, res, next) => {
    try {
        const { year } = req.body;

        const existingYear = await VehicleYear.findOne({ year });
        if (existingYear) {
            return res.status(400).json({
                status: false,
                message: 'Vehicle year already exists',
            });
        }

        const newYear = new VehicleYear({ year });
        await newYear.save();

        res.status(201).json({
            status: true,
            message: 'Vehicle year created successfully',
            data: newYear,
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                status: false,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
};

// Update a vehicle year by ID
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { year } = req.body;

        const updatedYear = await VehicleYear.findByIdAndUpdate(
            id,
            { year },
            { new: true }
        );

        if (!updatedYear) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle year not found',
            });
        }

        res.json({
            status: true,
            message: 'Vehicle year updated successfully',
            data: updatedYear,
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                status: false,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
};

// Delete a vehicle year by ID
const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedYear = await VehicleYear.findByIdAndDelete(id);

        if (!deletedYear) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle year not found',
            });
        }

        res.json({
            status: true,
            message: 'Vehicle year deleted successfully',
            data: deletedYear,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};
