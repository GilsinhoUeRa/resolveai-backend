// src/routes/usuarios.routes.js

const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');

// Correção: Importamos cada middleware do seu respectivo arquivo.
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = Router();

// --- ROTA PÚBLICA ---
// Qualquer um pode criar um novo usuário.
router.post('/', usuariosController.createUser);

// --- ROTAS PROTEGIDAS ---
// A rota mais específica '/me' deve vir ANTES da rota genérica '/:id'.
router.get('/me', checkAuth, usuariosController.getMe);

// Apenas um ADMIN pode ver todos os usuários.
router.get('/', checkAuth, checkRole(['ADMIN']), usuariosController.getAllUsers);

// Rotas para um usuário específico, protegidas por autenticação.
router.get('/:id', checkAuth, usuariosController.getUserById);
router.patch('/:id', checkAuth, usuariosController.updateUser);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), usuariosController.deleteUser);

module.exports = router;