// src/routes/especialidades.routes.js
const { Router } = require('express');
const especialidadesController = require('../controllers/especialidades.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = Router();

// Rota pública para buscar a lista de todas as especialidades
router.get('/', especialidadesController.getAllSpecialties);

// Rotas protegidas que só podem ser acedidas por administradores
router.post('/', checkAuth, checkRole(['ADMIN']), especialidadesController.createSpecialty);
router.patch('/:id', checkAuth, checkRole(['ADMIN']), especialidadesController.updateSpecialty);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), especialidadesController.deleteSpecialty);

module.exports = router;