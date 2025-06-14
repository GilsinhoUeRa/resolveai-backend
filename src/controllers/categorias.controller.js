// src/controllers/categorias.controller.js
const pool = require('../config/database');

exports.createCategory = async (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
    }

    try {
        const novaCategoria = await pool.query("INSERT INTO categorias (nome) VALUES ($1) RETURNING *", [nome]);
        res.status(201).json(novaCategoria.rows[0]);
    } catch (erro) {
        // Adiciona tratamento para o erro de violação de chave única
        if (erro.code === '23505') { 
            return res.status(409).json({ erro: 'Uma categoria com este nome já existe.' });
        }
        console.error('Erro ao criar categoria:', erro);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM categorias ORDER BY nome ASC');
        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    }
};