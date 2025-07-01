// src/routes/admin.routes.js
const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = Router();

// Todas as rotas de admin exigem autenticação e o papel de ADMIN
router.use(checkAuth, checkRole(['ADMIN']));

router.get('/stats', adminController.getDashboardStats);

module.exports = router;