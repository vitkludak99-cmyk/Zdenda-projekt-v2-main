// Přihlášený uživatel
exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error', 'Pro tuto akci musíš být přihlášen.');
  res.redirect('/login');
};

// Admin
exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Nemáš oprávnění.');
  res.redirect('/');
};
