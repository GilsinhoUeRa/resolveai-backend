// src/routes/prestadores.routes.js
const { Router } = require('express');
const prestadoresController = require('../controllers/prestadores.controller');
const checkAuth = require('../middlewares/checkAuth');

const router = Router();

// --- ROTAS PÚBLICAS ---

// Rota para buscar os prestadores em destaque para a HomePage
router.get('/destaques', prestadoresController.getFeaturedProviders);

// Rota para a futura página de busca de prestadores (com filtros)
router.get('/', prestadoresController.getAllProviders);

// Rota para buscar o perfil público de um prestador específico
router.get('/:id', prestadoresController.getProviderById);

// Nota: Rotas que modificam um prestador (como um admin editando um perfil)
// ficariam aqui, devidamente protegidas.

module.exports = router;