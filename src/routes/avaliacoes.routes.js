// src/routes/avaliacoes.routes.js
const { Router } = require('express');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');
const servicosController = require('../controllers/servicos.controller');

// A opção { mergeParams: true } é essencial para que este roteador 
// tenha acesso ao :servicoId da rota pai (definida em servicos.routes.js).
const router = Router({ mergeParams: true });

// Rota para criar uma avaliação para um serviço específico.
// O caminho aqui é '/', porque o prefixo '/:servicoId/avaliacoes' já foi definido no outro arquivo.
// A rota final será: POST /api/servicos/:servicoId/avaliacoes
router.post('/', checkAuth, checkRole(['CLIENTE']), servicosController.createReviewForService);

// No futuro, poderíamos adicionar aqui uma rota GET para buscar todas as avaliações de um serviço:
// router.get('/', servicosController.getReviewsForService);

module.exports = router;