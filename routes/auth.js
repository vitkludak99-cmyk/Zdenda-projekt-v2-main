const { Router } = require('express');
const { 
  getRegister, 
  postRegister, 
  getLogin, 
  postLogin, 
  logout 
} = require('../controllers/authController');

const router = Router();

// --- VÝCHOZÍ PŘESMĚROVÁNÍ ---
router.get('/', (req, res) => res.redirect('/games'));

// --- REGISTRACE ---
router.route('/register')
  .get(getRegister)
  .post(postRegister);

// --- PŘIHLÁŠENÍ ---
router.route('/login')
  .get(getLogin)
  .post(postLogin);

// --- ODHLÁŠENÍ ---
router.get('/logout', logout);

module.exports = router;