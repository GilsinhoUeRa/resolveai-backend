// src/routes/usuarios.routes.js (Versão Final Corrigida)

const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');

// Importação correta dos middlewares
const upload = require('../middlewares/upload.middleware');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = Router();

// --- ROTA PÚBLICA ---
router.post('/', usuariosController.createUser);

// --- ROTAS PROTEGIDAS ---

// --- ROTA DE UPLOAD DE FOTO ---
// Rota: PATCH /api/usuarios/me/photo
router.patch('/me/photo', checkAuth, upload.single('profileImage'), usuariosController.updateProfilePhoto);

// A rota '/me' deve vir ANTES de '/:id' para evitar conflitos.
router.get('/me', checkAuth, usuariosController.getMe);

// --- ROTAS DE FAVORITOS (aninhadas sob o usuário logado) ---
// Corrigido o comentário e adicionadas as rotas de favoritos
router.get('/me/favoritos', checkAuth, usuariosController.getFavorites);
router.post('/me/favoritos', checkAuth, checkRole(['CLIENTE']), usuariosController.addFavorite);
router.delete('/me/favoritos/:prestadorId', checkAuth, checkRole(['CLIENTE']), usuariosController.removeFavorite);

// --- ROTAS GERAIS DE USUÁRIO ---
router.get('/', checkAuth, checkRole(['ADMIN']), usuariosController.getAllUsers);
router.get('/:id', checkAuth, usuariosController.getUserById);
router.patch('/:id', checkAuth, usuariosController.updateUser);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), usuariosController.deleteUser);

module.exports = router;