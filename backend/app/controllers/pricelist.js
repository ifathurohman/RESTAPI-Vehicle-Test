const PriceList = require('../models/PriceList');
const VehicleYear = require('../models/VehicleYear');
const VehicleModel = require('../models/VehicleModel');

// GET all price lists
const index = async (req, res, next) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const offset = (page - 1) * limit;

        const [totalCount, priceLists] = await Promise.all([
            PriceList.countDocuments(),
            PriceList.find()
                .skip(offset)
                .limit(parseInt(limit))
                .populate('year_id')
                .populate('model_id')
                .exec()
        ]);

        return res.json({
            data: priceLists,
            metadata: {
                total: totalCount,
                limit: parseInt(limit),
                offset: offset,
                currentPage: parseInt(page),
                nextPage: totalCount > offset + priceLists.length ? parseInt(page) + 1 : null,
                prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : null
            },
        });
    } catch (err) {
        next(err);
    }
};


// GET one price list by ID
const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const priceList = await PriceList.findById(id)
            .populate('year_id')
            .populate('model_id');

        if (!priceList) {
            return res.status(404).json({ message: 'Price list not found' });
        }

        res.json(priceList);
    } catch (err) {
        next(err);
    }
};

// Create a new price list
const store = async (req, res, next) => {
    try {
        const { code, price, year_id, model_id } = req.body;

        // Check if the specified year_id and model_id exist
        const year = await VehicleYear.findById(year_id);
        if (!year) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle year not found',
            });
        }

        const model = await VehicleModel.findById(model_id);
        if (!model) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle model not found',
            });
        }

        // Check if a price list with the same code, year_id, and model_id already exists
        const existingPriceList = await PriceList.findOne({ code, year_id, model_id });
        if (existingPriceList) {
            return res.status(400).json({
                status: false,
                message: 'Price list with this code, year, and model already exists',
            });
        }

        // Create a new price list
        const newPriceList = new PriceList({
            code,
            price,
            year_id,
            model_id,
        });
        await newPriceList.save();

        res.status(201).json({
            status: true,
            message: 'Price list created successfully',
            data: newPriceList,
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

// Update a price list by ID
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, price, year_id, model_id } = req.body;

        // Check if the specified year_id and model_id exist
        const year = await VehicleYear.findById(year_id);
        if (!year) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle year not found',
            });
        }

        const model = await VehicleModel.findById(model_id);
        if (!model) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle model not found',
            });
        }

        // Update the price list
        const updatedPriceList = await PriceList.findByIdAndUpdate(
            id,
            { code, price, year_id, model_id },
            { new: true }
        );

        if (!updatedPriceList) {
            return res.status(404).json({
                status: false,
                message: 'Price list not found',
            });
        }

        res.json({
            status: true,
            message: 'Price list updated successfully',
            data: updatedPriceList,
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

// Delete a price list by ID
const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPriceList = await PriceList.findByIdAndDelete(id);

        if (!deletedPriceList) {
            return res.status(404).json({
                status: false,
                message: 'Price list not found',
            });
        }

        res.json({
            status: true,
            message: 'Price list deleted successfully',
            data: deletedPriceList,
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
