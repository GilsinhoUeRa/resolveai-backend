// src/routes/usuarios.routes.js (Versão Completa e Corrigida)

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
// Apenas usuários autenticados (com token válido) podem acessar as rotas abaixo.

// A rota mais específica '/me' deve vir ANTES da rota genérica '/:id' para funcionar.
router.get('/me', checkAuth, usuariosController.getMe);

// Rota para buscar todos os usuários, agora protegida para que apenas ADMINs possam acessá-la.
router.get('/', checkAuth, checkRole(['ADMIN']), usuariosController.getAllUsers);

// Rotas para um usuário específico.
router.get('/:id', checkAuth, usuariosController.getUserById);
router.patch('/:id', checkAuth, usuariosController.updateUser); // Assumimos que um usuário pode editar a si mesmo ou um admin pode editar outros.
router.delete('/:id', checkAuth, checkRole(['ADMIN']), usuariosController.deleteUser); // Apenas um ADMIN pode deletar usuários.

module.exports = router;