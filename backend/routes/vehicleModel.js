const router = require('express').Router();

const vehicleModel = require('../app/controllers/vehicleModel');
const { ensureAuthenticated, police_check } = require('../middlewares');

router.get('/model',
    ensureAuthenticated,
    police_check('view', 'vehicle model'),
    vehicleModel.index);
router.post(
    '/model',
    ensureAuthenticated,
    police_check('create', 'vehicle model'),
    vehicleModel.store,
);
router.put(
    '/model/:id',
    ensureAuthenticated,
    police_check('update', 'vehicle model'),
    vehicleModel.update,
);
router.delete(
    '/model/:id',
    ensureAuthenticated,
    police_check('delete', 'vehicle model'),
    vehicleModel.destroy,
);

router.delete(
    '/model',
    ensureAuthenticated,
    police_check('delete', 'vehicle model'),
    vehicleModel.destroyAllData,
);

module.exports = router;
