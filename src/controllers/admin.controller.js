// src/controllers/admin.controller.js
const adminService = require('../services/admin.service');

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json(stats);
    } catch (erro) {
        res.status(500).json({ erro: erro.message || 'Erro interno do servidor.' });
    }
};