// src/routes/usuarios.routes.js
const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');

const router = Router();

// --- ROTAS PÚBLICAS ---
router.post('/', usuariosController.createUser); // Qualquer um pode criar um usuário

// --- ROTAS PROTEGIDAS ---
// A rota mais específica '/me' deve vir ANTES da rota genérica '/:id'
router.get('/me', checkAuth, usuariosController.getMe); 

// Apenas um ADMIN pode ver todos os usuários
router.get('/', checkAuth, checkRole(['ADMIN']), usuariosController.getAllUsers);

// Rotas que podem ser acessadas por usuários autenticados
router.get('/:id', checkAuth, usuariosController.getUserById); 
router.patch('/:id', checkAuth, usuariosController.updateUser); 

// Apenas um ADMIN pode deletar um usuário
router.delete('/:id', checkAuth, checkRole(['ADMIN']), usuariosController.deleteUser); 

module.exports = router;