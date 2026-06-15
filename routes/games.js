const { Router } = require('express');
const { 
  index, 
  getNew, 
  create, 
  show, 
  getEdit, 
  update, 
  delete: deleteGame, 
  addReview, 
  deleteReview 
} = require('../controllers/gameController');

const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const upload = require('../config/multer');

const router = Router();

// --- ZKRATKY PRO MIDDLEWARE ---
// Místo neustálého psaní 'isLoggedIn, isAdmin' je můžeme spojit do pole
const requireAdmin = [isLoggedIn, isAdmin];
const uploadCover = upload.single('coverImage');


// --- ZÁKLADNÍ ROUTY (Zobrazení a přidání) ---
router.route('/')
  .get(index)
  .post(requireAdmin, uploadCover, create);

router.get('/new', requireAdmin, getNew);


// --- SPECIFICKÁ HRA (Detail a úpravy) ---
router.route('/:id')
  .get(show);

router.route('/:id/edit')
  .get(requireAdmin, getEdit)
  .post(requireAdmin, uploadCover, update);

router.post('/:id/delete', requireAdmin, deleteGame);


// --- RECENZE ---
router.post('/:id/review', isLoggedIn, addReview);
router.post('/:id/review/:rid/delete', isLoggedIn, deleteReview);

module.exports = router;