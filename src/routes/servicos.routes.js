// src/routes/servicos.routes.js
const express = require('express');
const router = express.Router();
const servicosController = require('../controllers/servicos.controller');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole'); // Importa o novo middleware

// Note o encadeamento de middlewares: checkAuth -> checkRole -> controller
router.post('/', checkAuth, checkRole(['PRESTADOR']), servicosController.createService);
router.patch('/:id', checkAuth, checkRole(['PRESTADOR']), servicosController.updateService);
router.delete('/:id', checkAuth, checkRole(['PRESTADOR']), servicosController.deleteService);

// Rotas públicas (não precisam de papel específico, nem mesmo de login)
router.get('/', servicosController.getAllServices);
router.get('/:id', servicosController.getServiceById);


// --- ROTA ANINHADA PARA AVALIAÇÕES ---
// Importa o roteador de avaliações
const avaliacoesRouter = require('./avaliacoes.routes');

// Diz ao roteador de serviços para usar o roteador de avaliações
// para qualquer caminho que comece com /:servicoId/avaliacoes
router.use('/:servicoId/avaliacoes', avaliacoesRouter);

module.exports = router;