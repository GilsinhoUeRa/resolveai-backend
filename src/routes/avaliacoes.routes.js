// src/routes/avaliacoes.routes.js
const { Router } = require('express');

// Correção: Importamos cada middleware do seu próprio arquivo.
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const servicosController = require('../controllers/servicos.controller');

// A opção { mergeParams: true } está perfeita e é essencial.
const router = Router({ mergeParams: true });

// Rota para criar uma avaliação para um serviço específico.
// O caminho final será: POST /api/servicos/:servicoId/avaliacoes
router.post('/', checkAuth, checkRole(['CLIENTE']), servicosController.createReviewForService);

module.exports = router;