// src/routes/profissoes.routes.js
const { Router } = require('express');
const profissoesController = require('../controllers/profissoes.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = Router();

// --- ROTA PÚBLICA ---
// Qualquer pessoa (logada ou não) pode buscar a lista de profissões.
router.get('/', profissoesController.getAllProfessions);
router.get('/:id', profissoesController.getProfessionById);

// --- ROTAS DE ADMINISTRAÇÃO ---
// Apenas usuários autenticados com o papel 'ADMIN' podem criar, atualizar ou deletar profissões.
router.post('/', checkAuth, checkRole(['ADMIN']), profissoesController.createProfession);
router.patch('/:id', checkAuth, checkRole(['ADMIN']), profissoesController.updateProfession);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), profissoesController.deleteProfession);

module.exports = router;