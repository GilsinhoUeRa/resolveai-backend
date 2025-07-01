// src/routes/usuarios.routes.js (Versão Definitiva e Organizada)

const { Router } = require('express');

// --- BLOCO ÚNICO DE IMPORTAÇÕES ---

// 1. Controller (A rota só fala com o controller)
const usuariosController = require('../controllers/usuarios.controller');

// 2. Middlewares e Validators
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema } = require('../validators/usuarios.validator');

// --- FIM DO BLOCO DE IMPORTAÇÕES ---

const router = Router();

// ========= ROTAS PÚBLICAS =========
router.post('/', validate(createUserSchema), usuariosController.createUser);

// ========= ROTAS PROTEGIDAS (requerem apenas login) =========
router.use(checkAuth); // Aplica checkAuth a todas as rotas abaixo

// A rota '/me' deve vir ANTES de '/:id' para evitar conflitos.
router.get('/me', usuariosController.getMe);
router.patch('/me/photo', upload.single('profileImage'), usuariosController.updateProfilePhoto);

router.get('/me/avaliacoes', usuariosController.getMyReviews);

// --- ROTAS DE FAVORITOS (aninhadas sob o usuário logado) ---
// Estas rotas não precisam mais do checkAuth individual, pois já foi aplicado acima.
router.get('/me/favoritos', usuariosController.getFavorites);

// ========= ROTAS PROTEGIDAS POR PAPEL (ROLE) =========

// --- ROTA PARA CLIENTES ---
router.patch('/me/provider-profile', checkRole(['CLIENTE']), usuariosController.becomeProvider);
router.post('/me/favoritos', checkRole(['CLIENTE']), usuariosController.addFavorite);
router.delete('/me/favoritos/:prestadorId', checkRole(['CLIENTE']), usuariosController.removeFavorite);

// --- ROTAS PARA ADMINS ---
router.get('/', checkRole(['ADMIN']), usuariosController.getAllUsers);
router.delete('/:id', checkRole(['ADMIN']), usuariosController.deleteUser);

// --- ROTAS GERAIS (protegidas por login, mas abertas a múltiplos papéis) ---
// A rota de updateUser tem sua própria verificação de permissão dentro do controller,
// garantindo que um usuário só pode editar a si mesmo, ou um admin pode editar qualquer um.
router.get('/:id', usuariosController.getUserById);
router.patch('/:id', usuariosController.updateUser);




module.exports = router;