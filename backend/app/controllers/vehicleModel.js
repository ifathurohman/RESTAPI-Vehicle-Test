const VehicleModel = require('../models/VehicleModel');
const VehicleType = require('../models/VehicleType');

const index = async (req, res, next) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const offset = (page - 1) * limit;

        const [totalCount, models] = await Promise.all([
            VehicleModel.countDocuments(),
            VehicleModel.find().skip(offset).limit(parseInt(limit)).exec()
        ]);

        return res.json({
            data: models,
            metadata: {
                total: totalCount,
                limit: parseInt(limit),
                offset: offset,
                currentPage: page,
                nextPage: totalCount > offset + models.length ? parseInt(page) + 1 : null,
                prevPage: page > 1 ? parseInt(page) - 1 : null
            },
        });
    } catch (err) {
        next(err);
    }
};

const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const model = await VehicleModel.findById(id).populate('type_id');

        if (!model) {
            return res.status(404).json({ message: 'Vehicle model not found' });
        }

        res.json(model);
    } catch (err) {
        next(err);
    }
};

const store = async (req, res, next) => {
    try {
        let payload = req.body;

        const existingModel = await VehicleModel.findOne({
            name: payload.name,
            type_id: payload.type_id
        });
        if (existingModel) {
            return res.status(400).json({
                status: false,
                message: 'Vehicle model with this name and type already exists',
            });
        }

        const type = await VehicleType.findById(payload.type_id);
        if (!type) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle type not found',
            });
        }

        const vehicleModel = new VehicleModel({
            name: payload.name,
            type_id: payload.type_id,
        });

        await vehicleModel.save();

        return res.status(201).json({
            status: true,
            message: 'Vehicle model successfully added',
            data: vehicleModel,
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

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, type_id } = req.body;

        const type = await VehicleType.findById(type_id);
        if (!type) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle type not found',
            });
        }

        const updatedModel = await VehicleModel.findByIdAndUpdate(
            id,
            { name, type_id },
            { new: true }
        );

        if (!updatedModel) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle model not found',
            });
        }

        res.json({
            status: true,
            message: 'Vehicle model updated successfully',
            data: updatedModel,
        });
    } catch (err) {
        next(err);
    }
};

const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedModel = await VehicleModel.findByIdAndDelete(id);

        if (!deletedModel) {
            return res.status(404).json({
                status: false,
                message: 'Vehicle model not found',
            });
        }

        res.json({
            status: true,
            message: 'Vehicle model deleted successfully',
            data: deletedModel,
        });
    } catch (err) {
        next(err);
    }
};

const destroyAllData = async (req, res, next) => {
    try {
        const result = await VehicleModel.deleteMany();
        res.json({
            status: true,
            message: 'All vehicle models deleted successfully',
            data: result,
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
    destroy,
    destroyAllData
};
