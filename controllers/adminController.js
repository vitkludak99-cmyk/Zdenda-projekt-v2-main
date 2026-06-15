const User = require('../models/User');
const Game = require('../models/Game');

// GET /admin
exports.dashboard = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const games = await Game.find();
    res.render('admin/dashboard', { users, games });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// POST /admin/users/:id/role – změna role
exports.changeRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { req.flash('error', 'Uživatel nenalezen.'); return res.redirect('/admin'); }
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    req.flash('success', `Role uživatele ${user.username} změněna na ${user.role}.`);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
};

// DELETE /admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'Uživatel smazán.');
    res.redirect('/admin');
  } catch (err) {
    res.redirect('/admin');
  }
};
