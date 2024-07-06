const router = require('express').Router();

const vehicleType = require('../app/controllers/vehicleType');
const { ensureAuthenticated, police_check } = require('../middlewares');

router.get('/type',
    ensureAuthenticated,
    police_check('view', 'vehicle type'),
    vehicleType.index);
router.post(
    '/type',
    ensureAuthenticated,
    police_check('create', 'vehicle type'),
    vehicleType.store,
);
router.put(
    '/type/:id',
    ensureAuthenticated,
    police_check('update', 'vehicle type'),
    vehicleType.update,
);
router.delete(
    '/type/:id',
    ensureAuthenticated,
    police_check('delete', 'vehicle type'),
    vehicleType.destroy,
);
router.delete(
    '/type',
    ensureAuthenticated,
    police_check('delete', 'vehicle type'),
    vehicleType.destroyAllData,
);

module.exports = router;
