// src/controllers/auth.controller.js (VERSÃO DE DEPURAÇÃO)
const authService = require('../services/auth.service');

exports.login = async (req, res) => {
    console.log('[CONTROLLER] Rota de login acionada.');
    console.log('[CONTROLLER] Conteúdo de req.body:', req.body);

    try {
        const { email, senha } = req.body;
        console.log(`[CONTROLLER] Dados extraídos: email=${email}, senha=${senha}`);

        if (!email || !senha) {
            console.log('[CONTROLLER] Erro de validação: Email ou senha em falta.');
            return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
        }

        const resultado = await authService.login(email, senha);
        console.log('[CONTROLLER] Serviço executado com sucesso. A enviar token.');
        res.status(200).json(resultado);
    } catch (erro) {
        console.error('[CONTROLLER] Erro capturado no catch:', erro);
        const statusCode = erro.statusCode || 500;
        res.status(statusCode).json({ erro: erro.message });
    }
};