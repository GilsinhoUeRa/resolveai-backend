// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const resultado = await authService.login(email, senha);
        res.status(200).json(resultado);
    } catch (erro) {
        // --- MUDANÇA PARA DEPURAÇÃO ---
        // Imprime o erro completo no console do servidor para máxima visibilidade
        console.error('[ERRO CAPTURADO NO CONTROLLER]:', erro);

        const statusCode = erro.statusCode || 500;

        // Retorna a mensagem de erro real na resposta da API, para que o teste a capture
        res.status(statusCode).json({ 
            erro: erro.message || 'Erro interno do servidor.',
            // Opcional: envia o stack trace em ambiente de teste para análise completa
            stack: process.env.NODE_ENV === 'test' ? erro.stack : undefined
        });
        // --- FIM DA MUDANÇA ---
    }
};