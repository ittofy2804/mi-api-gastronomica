const express = require('express');
const router = express.Router();
const subscriptionsDao = require('../dao/subscriptions.dao');

router.get('/', subscriptionsDao.getAll);
router.post('/', subscriptionsDao.create);
router.get('/:id', subscriptionsDao.getById);
router.put('/:id', subscriptionsDao.update);
router.delete('/:id', subscriptionsDao.remove);

module.exports = router;
