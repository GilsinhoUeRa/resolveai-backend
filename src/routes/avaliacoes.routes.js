// src/routes/avaliacoes.routes.js
const { Router } = require('express');
const avaliacoesController = require('../controllers/avaliacoes.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

// { mergeParams: true } permite aceder a parâmetros da rota pai (ex: /servicos/:servicoId)
const router = Router({ mergeParams: true });

// POST /api/servicos/:servicoId/avaliacoes - Apenas clientes podem criar avaliações
router.post('/', checkAuth, checkRole(['CLIENTE']), avaliacoesController.createReview);

// GET /api/servicos/:servicoId/avaliacoes - Rota pública para ver as avaliações de um serviço
router.get('/', avaliacoesController.getReviewsForService);

module.exports = router;