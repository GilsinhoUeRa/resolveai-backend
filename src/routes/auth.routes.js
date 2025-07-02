// src/routes/auth.routes.js
const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth.controller');

const router = Router();

// --- ROTA DE LOGIN TRADICIONAL ---
router.post('/login', authController.login);

// --- ROTAS DE LOGIN COM GOOGLE (OAUTH 2.0) ---

// 1. Rota de Início da Autenticação
// Quando o utilizador clica em "Login com Google", o frontend redireciona para este URL.
// O Passport irá então redirecionar para a página de login do Google.
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] // Pedimos ao Google o perfil e o email do utilizador
  })
);

// 2. Rota de Callback
// Após o utilizador fazer o login no Google, o Google redireciona de volta para este URL.
// O Passport irá então executar a nossa lógica de "find or create" que definimos na estratégia.
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login/failed', // Rota para onde redirecionar em caso de erro
    session: false // Como usamos JWT, não precisamos de sessões do Express
  }),
  (req, res) => {
    // Se a autenticação for bem-sucedida, o 'user' do Passport é anexado ao req.user.
    // Agora, criamos o nosso próprio JWT para o nosso sistema.
    const token = jwt.sign(
      { userId: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // A melhor prática é redirecionar de volta para o frontend com o token nos parâmetros da URL.
    // O frontend irá então ler este token e guardá-lo no localStorage.
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

// Rota de falha (opcional, mas boa prática)
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: "Falha na autenticação com o Google."
  });
});

module.exports = router;