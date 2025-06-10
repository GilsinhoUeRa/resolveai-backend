// src/controllers/avaliacoes.controller.js
const pool = require('../config/database');

exports.createReview = async (req, res) => {
    // O ID do serviço vem dos parâmetros da rota aninhada
    const { servicoId } = req.params;
    // O ID do cliente vem do token de autenticação
    const clienteId = req.userData.userId;
    // A nota e o comentário vêm do corpo da requisição
    const { nota, comentario } = req.body;

    try {
        const novaAvaliacao = await pool.query(
            "INSERT INTO avaliacoes (nota, comentario, cliente_id, servico_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [nota, comentario, clienteId, servicoId]
        );
        res.status(201).json(novaAvaliacao.rows[0]);
    } catch (erro) {
        console.error('Erro ao criar avaliação:', erro);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    }
};

exports.getReviewsForService = async (req, res) => {
    const { servicoId } = req.params;
    try {
        // Usamos um JOIN para pegar também o nome do cliente que fez a avaliação
        const query = `
            SELECT a.id, a.nota, a.comentario, a.created_at, u.nome as nome_cliente
            FROM avaliacoes a
            JOIN usuarios u ON a.cliente_id = u.id
            WHERE a.servico_id = $1
            ORDER BY a.created_at DESC
        `;
        const resultado = await pool.query(query, [servicoId]);
        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao buscar avaliações:', erro);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    }
};