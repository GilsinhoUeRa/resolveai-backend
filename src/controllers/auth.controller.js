// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

/**
 * Controller responsável por orquestrar o fluxo de login.
 * Ele não contém lógica de negócio, apenas chama o serviço apropriado.
 */
exports.login = async (req, res) => {
    try {
        // 1. Extrai os dados da requisição.
        const { email, senha } = req.body;

        // 2. Chama o serviço para executar a lógica de negócio.
        const resultado = await authService.login(email, senha);

        // 3. Retorna a resposta de sucesso enviada pelo serviço.
        res.status(200).json(resultado);
        
    } catch (erro) {
        // 4. Captura qualquer erro lançado pelo serviço e formata a resposta de erro.
        const statusCode = erro.statusCode || 500;
        res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
    }
};

// O 'module.exports' é desnecessário quando se usa 'exports.funcao'
// mas pode ser mantido se preferir.
module.exports = exports;