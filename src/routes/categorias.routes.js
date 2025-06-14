// src/routes/categorias.routes.js
const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');

// Importamos os middlewares de autenticação e autorização
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

// Rota pública para buscar todas as categorias
router.get('/', categoriasController.getAllCategories);

// Rota protegida para criar uma nova categoria.
// Apenas usuários autenticados com o papel de 'ADMIN' podem acessá-la.
router.post('/', checkAuth, checkRole(['ADMIN']), categoriasController.createCategory);

module.exports = router;


