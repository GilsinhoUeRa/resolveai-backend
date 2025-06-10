// src/controllers/avaliacoes.controller.js
const pool = require('../config/database');

exports.createReview = async (req, res) => {
    try {
        // --- LÓGICA MOVIDA PARA DENTRO DO TRY ---
        const { servicoId } = req.params;
        const clienteId = req.userData.userId;

        // --- VALIDAÇÃO DE ENTRADA ---
        // Se não houver corpo na requisição, retorna um erro claro.
        if (!req.body) {
            return res.status(400).json({ erro: 'Corpo da requisição ausente. Envie a nota e o comentário.' });
        }
        
        const { nota, comentario } = req.body;

        // Se o campo obrigatório 'nota' não foi enviado.
        if (nota === undefined) {
            return res.status(400).json({ erro: 'O campo "nota" é obrigatório.' });
        }

        // --- LÓGICA DO BANCO DE DADOS ---
        const novaAvaliacao = await pool.query(
            "INSERT INTO avaliacoes (nota, comentario, cliente_id, servico_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [nota, comentario, clienteId, servicoId]
        );
        res.status(201).json(novaAvaliacao.rows[0]);

    } catch (erro) {
        // Agora, qualquer erro (incluindo o TypeError) será capturado aqui.
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