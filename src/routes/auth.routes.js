// src/routes/auth.routes.js

const { Router } = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = Router();

// --- Rota de Login Tradicional ---
router.post('/login', authController.login);

// --- Rotas de Autenticação com Google (OAuth 2.0) ---

// Rota de Início do Fluxo: O frontend redireciona para cá.
// O Passport assume e redireciona para a página de consentimento do Google.
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'], // Informações que pedimos ao Google
    session: false // A nossa API é stateless, usamos JWT e não sessões
  })
);

// Rota de Callback: O Google redireciona para cá após o utilizador consentir.
router.get('/google/callback', 
  passport.authenticate('google', { 
    // Em caso de falha (ex: o utilizador nega o acesso), redireciona de volta para a página de login do frontend.
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false 
  }),
  // Se a autenticação do Passport for bem-sucedida, o controlo passa para a nossa função no controller.
  authController.googleCallback 
);

module.exports = router;