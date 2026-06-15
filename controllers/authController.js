const User = require('../models/User');

// --- ZOBRAZENÍ FORMULÁŘŮ ---

const renderRegisterForm = (req, res) => {
  res.render('auth/register');
};

const renderLoginForm = (req, res) => {
  res.render('auth/login');
};


// --- ZPRACOVÁNÍ DAT ---

const handleRegistration = async (req, res) => {
  const { username, email, password, password2 } = req.body;

  try {
    // 1. Validace hesel
    if (password !== password2) {
      req.flash('error', 'Hesla se neshodují.');
      return res.redirect('/register');
    }

    // 2. Kontrola, zda uživatel již neexistuje
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      req.flash('error', 'Uživatel s tímto emailem nebo jménem už existuje.');
      return res.redirect('/register');
    }

    // 3. Vytvoření nového uživatele
    await User.create({ username, email, password });

    req.flash('success', 'Registrace proběhla úspěšně! Přihlaš se.');
    return res.redirect('/login');

  } catch (error) {
    console.error('Chyba registrace:', error);
    req.flash('error', 'Chyba při registraci.');
    return res.redirect('/register');
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Nalezení uživatele a ověření hesla
    const user = await User.findOne({ email });
    const isPasswordValid = user ? await user.comparePassword(password) : false;

    if (!user || !isPasswordValid) {
      req.flash('error', 'Nesprávný email nebo heslo.');
      return res.redirect('/login');
    }

    // 2. Uložení dat do session
    req.session.user = { 
      _id: user._id, 
      username: user.username, 
      role: user.role 
    };

    req.flash('success', `Vítej, ${user.username}!`);
    return res.redirect('/games');

  } catch (error) {
    console.error('Chyba přihlášení:', error);
    req.flash('error', 'Chyba při přihlašování.');
    return res.redirect('/login');
  }
};

const handleLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};


// --- EXPORT MODULU ---

module.exports = {
  getRegister: renderRegisterForm,
  postRegister: handleRegistration,
  getLogin: renderLoginForm,
  postLogin: handleLogin,
  logout: handleLogout
};