// src/routes/servicos.routes.js
const { Router } = require('express');
const servicosController = require('../controllers/servicos.controller');
// 1. Importações unificadas e limpas do nosso middleware padrão
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
// Importamos o roteador de avaliações para delegar a ele
const avaliacoesRouter = require('./avaliacoes.routes');

const router = Router();

// --- ROTAS DE SERVIÇOS ---

// Rotas Públicas (qualquer um pode ver)
router.get('/', servicosController.getAllServices);
router.get('/:id', servicosController.getServiceById);
router.get('/reviews/provider/:providerId', servicosController.getReviewsByProviderId);

// Rotas Protegidas (apenas prestadores podem criar, editar, deletar serviços)
router.post('/', checkAuth, checkRole(['PRESTADOR']), servicosController.createService);
router.patch('/:id', checkAuth, checkRole(['PRESTADOR']), servicosController.updateService);
router.delete('/:id', checkAuth, checkRole(['PRESTADOR']), servicosController.deleteService);

// --- DELEGAÇÃO PARA ROTAS ANINHADAS DE AVALIAÇÕES ---
// 2. A rota para criar avaliações foi movida para o arquivo de avaliações.
// Qualquer requisição para /api/servicos/:servicoId/avaliacoes será gerenciada pelo 'avaliacoesRouter'
router.use('/:servicoId/avaliacoes', avaliacoesRouter);

module.exports = router;