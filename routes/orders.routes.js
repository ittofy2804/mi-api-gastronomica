const express = require('express');
const router = express.Router();
const ordersDao = require('../dao/orders.dao');

router.get('/', ordersDao.getAll);
router.post('/', ordersDao.create);
router.get('/:id', ordersDao.getById);
router.put('/:id', ordersDao.update);
router.delete('/:id', ordersDao.remove);

module.exports = router;
