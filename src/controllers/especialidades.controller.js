// src/controllers/especialidades.controller.js
const especialidadesService = require('../services/especialidades.service');

const handleControllerError = (res, erro) => {
    const statusCode = erro.statusCode || 500;
    res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
};

exports.getAllSpecialties = async (req, res) => {
    try {
        res.status(200).json(await especialidadesService.getAll());
    } catch (erro) { handleControllerError(res, erro); }
};

exports.createSpecialty = async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ erro: 'O nome é obrigatório.' });
        res.status(201).json(await especialidadesService.create(nome));
    } catch (erro) { handleControllerError(res, erro); }
};

exports.updateSpecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ erro: 'O nome é obrigatório.' });
        const result = await especialidadesService.update(parseInt(id), nome);
        if (!result) return res.status(404).json({ erro: 'Especialidade não encontrada.' });
        res.status(200).json(result);
    } catch (erro) { handleControllerError(res, erro); }
};

exports.deleteSpecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await especialidadesService.deleteById(parseInt(id));
        if (!success) return res.status(404).json({ erro: 'Especialidade não encontrada.' });
        res.status(204).send();
    } catch (erro) { handleControllerError(res, erro); }
};