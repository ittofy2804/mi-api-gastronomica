const express = require('express');
const router = express.Router();
const usersDao = require('../dao/users.dao');

router.get('/', usersDao.getAll);
router.post('/login', usersDao.login);
router.post('/', usersDao.create);
router.get('/:id', usersDao.getById);
router.put('/:id', usersDao.update);
router.delete('/:id', usersDao.remove);

module.exports = router;
