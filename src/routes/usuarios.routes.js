// src/routes/usuarios.routes.js

const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const { checkAuth, checkRole } = require('../middleware/auth.middleware');

const router = Router();

// As rotas agora são relativas ao prefixo que será definido no app.js
// Ex: Se app.use('/api/usuarios', router), então '/' vira '/api/usuarios'
// e '/:id' vira '/api/usuarios/:id'

router.post('/', usuariosController.createUser); // Rota: POST /api/usuarios
router.get('/', usuariosController.getAllUsers);   // Rota: GET /api/usuarios
router.get('/:id', usuariosController.getUserById); // Rota: GET /api/usuarios/:id
router.patch('/:id', usuariosController.updateUser); // Rota: PATCH /api/usuarios/:id
router.delete('/:id', usuariosController.deleteUser); // Rota: DELETE /api/usuarios/:id

module.exports = router;