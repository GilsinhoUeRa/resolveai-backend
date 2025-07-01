// src/controllers/profissoes.controller.js
const profissoesService = require('../services/profissoes.service');

// Função auxiliar para padronizar o tratamento de erros nos controllers
const handleControllerError = (res, erro) => {
    const statusCode = erro.statusCode || 500;
    res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
};

exports.getAllProfessions = async (req, res) => {
    try {
        const profissoes = await profissoesService.getAll();
        res.status(200).json(profissoes);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.getProfessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const profissao = await profissoesService.getById(parseInt(id));
        if (!profissao) {
            return res.status(404).json({ erro: 'Profissão não encontrada.' });
        }
        res.status(200).json(profissao);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.createProfession = async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        if (!nome || !descricao) {
            return res.status(400).json({ erro: 'Nome e descrição são obrigatórios.' });
        }
        const novaProfissao = await profissoesService.create({ nome, descricao });
        res.status(201).json(novaProfissao);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.updateProfession = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;
        if (!nome || !descricao) {
            return res.status(400).json({ erro: 'Nome e descrição são obrigatórios.' });
        }
        const profissaoAtualizada = await profissoesService.update(parseInt(id), { nome, descricao });
        if (!profissaoAtualizada) {
            return res.status(404).json({ erro: 'Profissão não encontrada.' });
        }
        res.status(200).json(profissaoAtualizada);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.deleteProfession = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await profissoesService.deleteById(parseInt(id));
        if (!success) {
            return res.status(404).json({ erro: 'Profissão não encontrada.' });
        }
        res.status(204).send();
    } catch (erro) {
        handleControllerError(res, erro);
    }
};