// src/controllers/categorias.controller.js
const categoriasService = require('../services/categorias.service');

const handleControllerError = (res, erro) => {
    const statusCode = erro.statusCode || 500;
    res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
};

exports.getAllCategories = async (req, res) => {
    try {
        const categorias = await categoriasService.getAll();
        res.status(200).json(categorias);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
        const novaCategoria = await categoriasService.create(nome);
        res.status(201).json(novaCategoria);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
        const categoriaAtualizada = await categoriasService.update(parseInt(id), nome);
        if (!categoriaAtualizada) return res.status(404).json({ erro: 'Categoria não encontrada.' });
        res.status(200).json(categoriaAtualizada);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await categoriasService.deleteById(parseInt(id));
        if (!success) return res.status(404).json({ erro: 'Categoria não encontrada.' });
        res.status(204).send();
    } catch (erro) {
        handleControllerError(res, erro);
    }
};