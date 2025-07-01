// src/controllers/avaliacoes.controller.js
const avaliacoesService = require('../services/avaliacoes.service');

// Função auxiliar para padronizar o tratamento de erros
const handleControllerError = (res, erro) => {
    const statusCode = erro.statusCode || 500;
    res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
};

/**
 * Controller para criar uma nova avaliação para um serviço.
 */
exports.createReview = async (req, res) => {
    try {
        // O ID do serviço vem dos parâmetros da rota aninhada
        const { servicoId } = req.params;
        // O ID do cliente vem do token de autenticação
        const clienteId = req.user.id;
        // Os dados da avaliação vêm do corpo da requisição
        const { nota, comentario } = req.body;

        if (!nota || !comentario) {
            return res.status(400).json({ erro: 'Nota e comentário são obrigatórios.' });
        }

        const novaAvaliacao = await avaliacoesService.create(
            parseInt(servicoId), 
            clienteId, 
            { nota, comentario }
        );

        res.status(201).json(novaAvaliacao);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

/**
 * Controller para buscar todas as avaliações de um serviço específico.
 */
exports.getReviewsForService = async (req, res) => {
    try {
        const { servicoId } = req.params;
        const avaliacoes = await avaliacoesService.getByServiceId(parseInt(servicoId));
        res.status(200).json(avaliacoes);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};