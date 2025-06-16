// src/controllers/usuarios.controller.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { cpf, cnpj } = require('cpf-cnpj-validator');

// C - Create
exports.createUser = async (req, res) => {
    const { nome, email, senha, tipo_pessoa, documento } = req.body;
    
    if (!tipo_pessoa || !documento || !nome || !email || !senha) {
        return res.status(400).json({ erro: "Todos os campos (nome, email, senha, tipo_pessoa, documento) são obrigatórios." });
    }

    const documentoLimpo = documento.replace(/\D/g, '');

    if ((tipo_pessoa === 'PF' && !cpf.isValid(documentoLimpo)) || (tipo_pessoa === 'PJ' && !cnpj.isValid(documentoLimpo))) {
        return res.status(400).json({ erro: "CPF ou CNPJ inválido." });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        const query = `
            INSERT INTO usuarios (nome, email, senha, tipo_pessoa, documento) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, nome, email, tipo_pessoa, documento, role, created_at`;
            
        const { rows } = await pool.query(query, [nome, email, hashSenha, tipo_pessoa, documentoLimpo]);
        res.status(201).json(rows[0]);
    } catch (erro) {
        if (erro.code === '23505') { // unique_violation
            return res.status(409).json({ erro: 'Este documento ou email já está cadastrado.' });
        }
        console.error('Erro ao criar usuário:', erro);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// R - Read (All)
exports.getAllUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, role, created_at FROM usuarios ORDER BY id ASC');
        res.status(200).json(rows);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// R - Read (Self - /me)
exports.getMe = async (req, res) => {
    // Assumindo que o middleware checkAuth adiciona o ID do usuário em req.usuarioId
    // ou informações do usuário em req.user.id
    const usuarioId = req.usuarioId; // Ou req.user.id, dependendo da sua implementação do checkAuth

    if (!usuarioId) {
        return res.status(400).json({ erro: "ID do usuário não encontrado na requisição. O token é válido?" });
    }

    try {
        const { rows } = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, role, created_at FROM usuarios WHERE id = $1', [usuarioId]);
        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (erro) {
        console.error('Erro ao buscar dados do usuário (getMe):', erro);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// R - Read (Specific by ID)
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        // Query corrigida para também buscar a role
        const { rows } = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, role, created_at FROM usuarios WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// U - Update
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nome, email, tipo_pessoa, documento } = req.body;
    try {
        // A query de update agora usa COALESCE para usar o valor existente se um novo não for fornecido
        const queryUpdate = `
            UPDATE usuarios 
            SET 
                nome = COALESCE($1, nome), 
                email = COALESCE($2, email), 
                tipo_pessoa = COALESCE($3, tipo_pessoa), 
                documento = COALESCE($4, documento)
            WHERE id = $5 
            RETURNING id, nome, email, tipo_pessoa, documento`;
            
        const valores = [nome, email, tipo_pessoa, documento, id];
        const { rows } = await pool.query(queryUpdate, valores);

        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado para atualizar' });
        }
        res.status(200).json(rows[0]);
    } catch (erro) {
        console.error(erro.message);
        if (erro.code === '23505') {
            return res.status(409).json({ erro: 'O email ou documento fornecido já pertence a outro usuário.' });
        }
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// D - Delete
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        res.status(204).send(); // 204 No Content é o status correto para um delete bem-sucedido
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};