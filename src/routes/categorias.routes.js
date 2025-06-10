// src/routes/categorias.routes.js
const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');
const checkAuth = require('../middleware/checkAuth');

// Criar categoria pode ser uma rota protegida para administradores no futuro
router.post('/', checkAuth, categoriasController.createCategory);
router.get('/', categoriasController.getAllCategories);

module.exports = router;