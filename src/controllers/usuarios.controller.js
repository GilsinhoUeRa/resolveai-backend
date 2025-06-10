// src/controllers/usuarios.controller.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { cpf, cnpj } = require('cpf-cnpj-validator'); // Importa os validadores

// C - Create
exports.createUser = async (req, res) => {
    // Novos campos chegam no corpo da requisição
    const { nome, email, senha, tipo_pessoa, documento } = req.body;
    
    // --- VALIDAÇÃO DE ENTRADA ---
    if (!tipo_pessoa || !documento) {
        return res.status(400).json({ erro: "Tipo de pessoa e documento são obrigatórios." });
    }

    // Limpa o documento, removendo qualquer pontuação
    const documentoLimpo = documento.replace(/\D/g, '');

    // Valida o documento de acordo com o tipo de pessoa
    if (tipo_pessoa === 'PF') {
        if (!cpf.isValid(documentoLimpo)) {
            return res.status(400).json({ erro: "CPF inválido." });
        }
    } else if (tipo_pessoa === 'PJ') {
        if (!cnpj.isValid(documentoLimpo)) {
            return res.status(400).json({ erro: "CNPJ inválido." });
        }
    } else {
        return res.status(400).json({ erro: "Tipo de pessoa inválido. Use 'PF' ou 'PJ'." });
    }

    // --- LÓGICA DO BANCO DE DADOS ---
    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        
        // Query atualizada para incluir os novos campos
        const query = `
            INSERT INTO usuarios (nome, email, senha, tipo_pessoa, documento) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, nome, email, tipo_pessoa, documento`;
            
        const novoUsuario = await pool.query(query, [nome, email, hashSenha, tipo_pessoa, documentoLimpo]);

        res.status(201).json(novoUsuario.rows[0]);
    } catch (erro) {
        // Trata o erro de documento duplicado (código '23505' para unique_violation no PostgreSQL)
        if (erro.code === '23505') {
            return res.status(409).json({ erro: 'Este documento ou email já está cadastrado.' });
        }
        console.error('Erro ao criar usuário:', erro);
        res.status(500).json({ erro: "Ocorreu um erro no servidor." });
    }
};

// R - Read (All)
exports.getAllUsers = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, created_at FROM usuarios ORDER BY id ASC');
        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Ocorreu um erro no servidor." });
    }
};

// R - Read (Specific)
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, created_at FROM usuarios WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Ocorreu um erro no servidor." });
    }
};

// U - Update
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nome, email, tipo_pessoa, documento } = req.body;
    try {
        const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (usuarioExistente.rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        const queryUpdate = `UPDATE usuarios SET nome = $1, email = $2, tipo_pessoa = $4, documento = $5 WHERE id = $3 RETURNING id, nome, email, tipo_pessoa, documento`;
        const valores = [
            nome || usuarioExistente.rows[0].nome,
            email || usuarioExistente.rows[0].email,
			tipo_pessoa || usuarioExistente.rows[0].tipo_pessoa,
			documento || usuarioExistente.rows[0].documento,
            id
        ];
        const resultado = await pool.query(queryUpdate, valores);
        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Ocorreu um erro no servidor." });
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
        res.status(204).send();
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Ocorreu um erro no servidor." });
    }
};