// src/routes/auth.routes.js
const { Router } = require('express'); // Usando a mesma sintaxe dos outros arquivos de rota
const authController = require('../controllers/auth.controller');

const router = Router();

// Rota de Login: POST /api/login
router.post('/login', authController.login);

module.exports = router;