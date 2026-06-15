const Game = require('../models/Game');

// GET /games – seznam her
exports.index = async (req, res) => {
  try {
    const { q, genre, platform } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (genre) filter.genre = genre;
    if (platform) filter.platform = platform;

    const games = await Game.find(filter).sort({ createdAt: -1 });
    res.render('games/index', { games, q, genre, platform });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// GET /games/:id – detail
exports.show = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('reviews.user', 'username');
    if (!game) { req.flash('error', 'Hra nenalezena.'); return res.redirect('/games'); }
    // Zkontroluj, jestli uživatel už přidal recenzi
    let userReview = null;
    if (req.session.user) {
      userReview = game.reviews.find(r => r.user._id.toString() === req.session.user._id.toString());
    }
    res.render('games/show', { game, userReview });
  } catch (err) {
    console.error(err);
    res.redirect('/games');
  }
};

// GET /games/new
exports.getNew = (req, res) => res.render('games/form', { game: null });

// POST /games
exports.create = async (req, res) => {
  try {
    const { title, description, genre, developer, releaseYear, platform } = req.body;
    const coverImage = req.file ? req.file.filename : 'default-cover.png';
    const platforms = Array.isArray(platform) ? platform : (platform ? [platform] : []);

    await Game.create({
      title, description, genre, developer,
      releaseYear: Number(releaseYear),
      platform: platforms,
      coverImage,
      addedBy: req.session.user._id
    });
    req.flash('success', 'Hra byla přidána!');
    res.redirect('/games');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Chyba při přidávání hry.');
    res.redirect('/games/new');
  }
};

// GET /games/:id/edit
exports.getEdit = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) { req.flash('error', 'Hra nenalezena.'); return res.redirect('/games'); }
    res.render('games/form', { game });
  } catch (err) {
    res.redirect('/games');
  }
};

// PUT /games/:id  (simulováno přes POST s _method)
exports.update = async (req, res) => {
  try {
    const { title, description, genre, developer, releaseYear, platform } = req.body;
    const platforms = Array.isArray(platform) ? platform : (platform ? [platform] : []);
    const update = { title, description, genre, developer, releaseYear: Number(releaseYear), platform: platforms };
    if (req.file) update.coverImage = req.file.filename;

    await Game.findByIdAndUpdate(req.params.id, update);
    req.flash('success', 'Hra byla aktualizována!');
    res.redirect('/games/' + req.params.id);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Chyba při úpravě hry.');
    res.redirect('/games/' + req.params.id + '/edit');
  }
};

// DELETE /games/:id
exports.delete = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    req.flash('success', 'Hra byla smazána.');
    res.redirect('/games');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Chyba při mazání.');
    res.redirect('/games');
  }
};

// POST /games/:id/review
exports.addReview = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.redirect('/games');

    // Jeden review na uživatele
    const already = game.reviews.some(r => r.user.toString() === req.session.user._id.toString());
    if (already) {
      req.flash('error', 'Recenzi jsi už přidal.');
      return res.redirect('/games/' + req.params.id);
    }

    game.reviews.push({ user: req.session.user._id, rating: Number(req.body.rating), text: req.body.text });
    await game.save();
    req.flash('success', 'Recenze přidána!');
    res.redirect('/games/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.redirect('/games/' + req.params.id);
  }
};

// DELETE /games/:id/review/:rid
exports.deleteReview = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    game.reviews = game.reviews.filter(r => r._id.toString() !== req.params.rid);
    await game.save();
    req.flash('success', 'Recenze smazána.');
    res.redirect('/games/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.redirect('/games/' + req.params.id);
  }
};
