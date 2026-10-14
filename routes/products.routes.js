const express = require('express');
const router = express.Router();
const productsDao = require('../dao/products.dao');

router.get('/', productsDao.getAll);
router.post('/', productsDao.create);
router.get('/:id', productsDao.getById);
router.put('/:id', productsDao.update);
router.delete('/:id', productsDao.remove);

module.exports = router;
