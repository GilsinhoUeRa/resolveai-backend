// src/controllers/prestadores.controller.js
const prestadoresService = require('../services/prestadores.service');

// Função auxiliar para padronizar o tratamento de erros
const handleControllerError = (res, erro) => {
    const statusCode = erro.statusCode || 500;
    res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
};

/**
 * Controller para buscar os prestadores em destaque.
 */
exports.getFeaturedProviders = async (req, res) => {
    try {
        const prestadores = await prestadoresService.getFeaturedProviders();
        res.status(200).json(prestadores);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

/**
 * Controller para buscar todos os prestadores (com filtros futuros).
 */
exports.getAllProviders = async (req, res) => {
    try {
        // No futuro, passaremos os filtros de req.query para o serviço
        const prestadores = await prestadoresService.getAllProviders();
        res.status(200).json(prestadores);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

/**
 * Controller para buscar um prestador específico pelo ID.
 */
exports.getProviderById = async (req, res) => {
    try {
        const { id } = req.params;
        const prestador = await prestadoresService.getProviderById(parseInt(id));
        if (!prestador) {
            return res.status(404).json({ erro: 'Prestador não encontrado.' });
        }
        res.status(200).json(prestador);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};