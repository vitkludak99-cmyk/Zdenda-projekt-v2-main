const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

router.use(isLoggedIn, isAdmin);

router.get('/', ctrl.dashboard);
router.post('/users/:id/role', ctrl.changeRole);
router.post('/users/:id/delete', ctrl.deleteUser);

module.exports = router;
