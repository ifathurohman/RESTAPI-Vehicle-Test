const router = require('express').Router();

const vehicleBrand = require('../app/controllers/vehicleBrand');
const { ensureAuthenticated, police_check } = require('../middlewares');

router.get('/brand',
    ensureAuthenticated,
    police_check('view', 'vehicle brand'),
    vehicleBrand.index);
router.post(
    '/brand',
    ensureAuthenticated,
    police_check('create', 'vehicle brand'),
    vehicleBrand.store,
);
router.put(
    '/brand/:id',
    ensureAuthenticated,
    police_check('update', 'vehicle brand'),
    vehicleBrand.update,
);
router.delete(
    '/brand/:id',
    ensureAuthenticated,
    police_check('delete', 'vehicle brand'),
    vehicleBrand.destroy,
);

router.delete(
    '/brand',
    ensureAuthenticated,
    police_check('delete', 'vehicle brand'),
    vehicleBrand.destroyAllData,
);

module.exports = router;
