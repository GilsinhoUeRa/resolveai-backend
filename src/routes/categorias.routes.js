// src/routes/categorias.routes.js
const { Router } = require('express');
const categoriasController = require('../controllers/categorias.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = Router();

// Rota Pública para buscar todas as categorias
router.get('/', categoriasController.getAllCategories);

// Rotas de Admin (protegidas)
router.post('/', checkAuth, checkRole(['ADMIN']), categoriasController.createCategory);
router.patch('/:id', checkAuth, checkRole(['ADMIN']), categoriasController.updateCategory);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), categoriasController.deleteCategory);

module.exports = router;