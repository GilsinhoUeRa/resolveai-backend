// src/controllers/servicos.controller.js (Versão Final Corrigida)

const pool = require('../config/database');

// C - Create
exports.createService = async (req, res) => {
    const { nome, descricao, preco, categorias } = req.body;
    const usuario_id = req.user.id; // Correção aqui
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryServico = "INSERT INTO servicos (nome, descricao, preco, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *";
        const novoServicoResult = await client.query(queryServico, [nome, descricao, preco, usuario_id]);
        const novoServico = novoServicoResult.rows[0];
        if (categorias && categorias.length > 0) {
            const queryAssociacao = "INSERT INTO servicos_categorias (servico_id, categoria_id) VALUES ($1, $2)";
            for (const categoria_id of categorias) {
                await client.query(queryAssociacao, [novoServico.id, categoria_id]);
            }
        }
        await client.query('COMMIT');
        res.status(201).json(novoServico);
    } catch (erro) {
        await client.query('ROLLBACK');
        console.error(erro.message);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    } finally {
        client.release();
    }
};

// R - Read (All)
exports.getAllServices = async (req, res) => {
    // ... sua função getAllServices (que já está ótima) ...
};

// R - Read (Specific)
exports.getServiceById = async (req, res) => {
    // ... sua função getServiceById ...
};

// U - Update
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user; // Correção aqui (usando desestruturação para clareza)
    const { nome, descricao, preco } = req.body;
    // ... resto da sua função updateUser (que já está ótima) ...
};

// D - Delete
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user; // Correção aqui
    // ... resto da sua função deleteService (que já está ótima) ...
};

// Funções para Avaliações
exports.getReviewsByProviderId = async (req, res) => {
    // ... sua função getReviewsByProviderId ...
};

exports.createReviewForService = async (req, res) => {
    // ... sua função createReviewForService ...
};