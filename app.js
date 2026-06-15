require('dotenv').config();

// --- ZÁKLADNÍ IMPORTY ---
const { join } = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

// --- IMPORTY ROUTERŮ ---
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const adminRoutes = require('./routes/admin');

// --- INICIALIZACE A PROMĚNNÉ ---
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;


// --- PŘIPOJENÍ K DATABÁZI ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB připojeno'))
  .catch((err) => console.error('❌ Chyba připojení k MongoDB:', err));


// --- NASTAVENÍ VIEW ENGINE ---
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));


// --- ZÁKLADNÍ MIDDLEWARE ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());


// --- GLOBÁLNÍ PROMĚNNÉ (pro EJS šablony) ---
const setGlobalLocals = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
};

app.use(setGlobalLocals);


// --- SMĚROVÁNÍ (ROUTING) ---
app.use('/', authRoutes);
app.use('/games', gameRoutes);
app.use('/admin', adminRoutes);


// --- ZPRACOVÁNÍ CHYB (404) ---
const handleNotFound = (req, res) => {
  res.status(404).render('404');
};

app.use(handleNotFound);


// --- SPUŠTĚNÍ SERVERU ---
app.listen(PORT, () => {
  console.log(`🚀 Server úspěšně běží na http://localhost:${PORT}`);
});