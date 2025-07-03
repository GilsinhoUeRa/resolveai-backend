// src/routes/auth.routes.js (Versão Final de Verificação)
const { Router } = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = Router();

// Rota de Login Tradicional
router.post('/login', authController.login);

// Rota de Início da Autenticação com Google
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

// Rota de Callback do Google
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false 
  }),
  authController.googleCallback
);

module.exports = router;