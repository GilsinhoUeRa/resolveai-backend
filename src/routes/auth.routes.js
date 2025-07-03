// src/routes/auth.routes.js
const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth.controller');

const router = Router();

// --- ROTA DE LOGIN TRADICIONAL ---
router.post('/login', authController.login);

// --- ROTAS DE LOGIN COM GOOGLE (OAUTH 2.0) ---
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

module.exports = router;