// src/routes/avaliacoes.routes.js
const { Router } = require('express');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const servicosController = require('../controllers/servicos.controller');

// mergeParams: true é essencial para que este roteador tenha acesso ao :servicoId da rota pai
const router = Router({ mergeParams: true });

// Rota para criar uma avaliação para um serviço específico
// O caminho aqui é '/', porque o prefixo '/:servicoId/avaliacoes' já foi definido no arquivo anterior.
// A rota final será: POST /api/servicos/:servicoId/avaliacoes
router.post('/', checkAuth, checkRole(['CLIENTE']), servicosController.createReviewForService);

// No futuro, podemos adicionar aqui uma rota GET para buscar todas as avaliações de um serviço
// router.get('/', servicosController.getReviewsForService);

module.exports = router;