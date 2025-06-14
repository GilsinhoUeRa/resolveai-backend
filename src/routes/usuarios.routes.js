// src/routes/usuarios.routes.js (Versão Final Corrigida)

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
// A rota mais específica '/me' deve vir ANTES da rota genérica '/:id' para funcionar.
router.get('/me', checkAuth, usuariosController.getMe);

// Rota para buscar todos os usuários, agora protegida para que apenas ADMINs possam acessá-la.
router.get('/', checkAuth, checkRole(['ADMIN']), usuariosController.getAllUsers);

// Rotas para um usuário específico.
router.get('/:id', checkAuth, usuariosController.getUserById);
router.patch('/:id', checkAuth, usuariosController.updateUser);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), usuariosController.deleteUser);

module.exports = router;