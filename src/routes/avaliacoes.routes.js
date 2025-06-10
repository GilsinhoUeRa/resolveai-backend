// src/routes/avaliacoes.routes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // Habilita a passagem de parâmetros
const avaliacoesController = require('../controllers/avaliacoes.controller');
const checkAuth = require('../middleware/checkAuth');

// POST /api/servicos/:servicoId/avaliacoes
router.post('/', checkAuth, avaliacoesController.createReview);

// GET /api/servicos/:servicoId/avaliacoes
router.get('/', avaliacoesController.getReviewsForService);

module.exports = router;