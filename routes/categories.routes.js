const express = require('express');
const router = express.Router();
const categoriesDao = require('../dao/categories.dao');

router.get('/', categoriesDao.getAll);
router.post('/', categoriesDao.create);
router.get('/:id', categoriesDao.getById);
router.put('/:id', categoriesDao.update);
router.delete('/:id', categoriesDao.remove);

module.exports = router;
