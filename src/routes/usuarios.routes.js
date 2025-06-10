// src/routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// Mapeamento das rotas para as funções do controlador
router.post('/', usuariosController.createUser);
router.get('/', usuariosController.getAllUsers);
router.get('/:id', usuariosController.getUserById);
router.patch('/:id', usuariosController.updateUser);
router.delete('/:id', usuariosController.deleteUser);

module.exports = router;