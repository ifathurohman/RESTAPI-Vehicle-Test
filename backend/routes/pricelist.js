const router = require('express').Router();

const pricelist = require('../app/controllers/pricelist');
const { ensureAuthenticated, police_check } = require('../middlewares');

router.get('/price',
    ensureAuthenticated,
    police_check('view', 'vehicle price'),
    pricelist.index);
router.post(
    '/price',
    ensureAuthenticated,
    police_check('create', 'vehicle price'),
    pricelist.store,
);
router.put(
    '/price/:id',
    ensureAuthenticated,
    police_check('update', 'vehicle price'),
    pricelist.update,
);
router.delete(
    '/price/:id',
    ensureAuthenticated,
    police_check('delete', 'vehicle price'),
    pricelist.destroy,
);

module.exports = router;
