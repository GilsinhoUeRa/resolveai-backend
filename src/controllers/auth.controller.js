// src/controllers/auth.controller.js (VERSÃO DE DEPURAÇÃO)
const authService = require('../services/auth.service');

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
        }
        const resultado = await authService.login(email, senha);
        res.status(200).json(resultado);
    } catch (erro) {
        const statusCode = erro.statusCode || 500;
        res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
    }
};