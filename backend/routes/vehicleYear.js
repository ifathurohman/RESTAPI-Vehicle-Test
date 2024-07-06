const router = require('express').Router();

const vehicleYear = require('../app/controllers/vehicleYear');
const { ensureAuthenticated, police_check } = require('../middlewares');

router.get('/year',
    ensureAuthenticated,
    police_check('view', 'vehicle year'),
    vehicleYear.index);
router.post(
    '/year',
    ensureAuthenticated,
    police_check('create', 'vehicle year'),
    vehicleYear.store,
);
router.put(
    '/year/:id',
    ensureAuthenticated,
    police_check('update', 'vehicle year'),
    vehicleYear.update,
);
router.delete(
    '/year/:id',
    ensureAuthenticated,
    police_check('delete', 'vehicle year'),
    vehicleYear.destroy,
);

module.exports = router;
