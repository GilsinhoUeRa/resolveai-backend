// src/controllers/chat.controller.js

const pool = require('../config/database');

// Inicia uma nova conversa ou busca uma existente entre dois usuários
exports.startOrGetChatSession = async (req, res) => {
    const { otherUserId } = req.body;
    const currentUserId = req.user.id;

    if (!otherUserId || String(otherUserId) === String(currentUserId)) {
        return res.status(400).json({ erro: 'ID do outro participante é inválido.' });
    }

    const client = await pool.connect();
    try {
        // Query para encontrar uma sessão que contenha AMBOS os usuários
        const findSessionQuery = `
            SELECT sessao_id FROM chat_participantes cp1
            JOIN chat_participantes cp2 ON cp1.sessao_id = cp2.sessao_id
            WHERE cp1.usuario_id = $1 AND cp2.usuario_id = $2;
        `;
        const existingSession = await client.query(findSessionQuery, [currentUserId, otherUserId]);

        // Se a sessão já existe, retorna o ID dela
        if (existingSession.rows.length > 0) {
            return res.status(200).json({ sessionId: existingSession.rows[0].sessao_id });
        }

        // Se não existe, cria uma nova sessão em uma transação para garantir a integridade
        await client.query('BEGIN');

        const newSessionResult = await client.query('INSERT INTO chat_sessoes DEFAULT VALUES RETURNING id');
        const newSessionId = newSessionResult.rows[0].id;

        const insertParticipantsQuery = 'INSERT INTO chat_participantes (sessao_id, usuario_id) VALUES ($1, $2), ($1, $3)';
        await client.query(insertParticipantsQuery, [newSessionId, currentUserId, otherUserId]);

        await client.query('COMMIT');

        res.status(201).json({ sessionId: newSessionId });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Erro ao iniciar sessão de chat:", error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    } finally {
        client.release();
    }
};


// Busca todas as sessões de chat do usuário logado
exports.getChatSessions = async (req, res) => {
    const userId = req.user.id;
    try {
        // Query complexa para buscar as sessões e os detalhes do outro participante,
        // junto com a última mensagem trocada.
        const query = `
            SELECT
                cs.id,
                cs.ultimo_contato as "updatedAt",
                json_build_object(
                    'id', u.id,
                    'nome', u.nome,
                    'photoUrl', u.foto_url
                ) as "otherParticipant",
                (SELECT json_build_object(
                    'id', cm.id,
                    'conteudo', cm.conteudo,
                    'remetente_id', cm.remetente_id,
                    'timestamp', cm.created_at
                 ) FROM chat_mensagens cm WHERE cm.sessao_id = cs.id ORDER BY cm.created_at DESC LIMIT 1
                ) as "lastMessage"
            FROM chat_sessoes cs
            JOIN chat_participantes cp ON cs.id = cp.sessao_id
            JOIN usuarios u ON u.id = (
                SELECT cp2.usuario_id FROM chat_participantes cp2
                WHERE cp2.sessao_id = cs.id AND cp2.usuario_id != $1
            )
            WHERE cp.usuario_id = $1
            ORDER BY cs.ultimo_contato DESC;
        `;
        const { rows } = await pool.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar sessões:", error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};


// Busca todas as mensagens de uma sessão específica
exports.getMessagesForSession = async (req, res) => {
    const { sessionId } = req.params;
    const userId = req.user.id;
    try {
        // Garante que o usuário logado é participante da sessão que ele está tentando acessar
        const participantCheck = await pool.query(
            'SELECT 1 FROM chat_participantes WHERE sessao_id = $1 AND usuario_id = $2',
            [sessionId, userId]
        );
        if (participantCheck.rowCount === 0) {
            return res.status(403).json({ erro: 'Acesso negado a esta conversa.' });
        }

        const { rows } = await pool.query(
            'SELECT id, sessao_id as "sessionId", remetente_id as "senderId", conteudo as "content", created_at as "timestamp" FROM chat_mensagens WHERE sessao_id = $1 ORDER BY created_at ASC',
            [sessionId]
        );
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};


// Envia uma nova mensagem para uma sessão
exports.sendMessage = async (req, res) => {
    const { sessionId } = req.params;
    const remetenteId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
        return res.status(400).json({ erro: 'O conteúdo da mensagem não pode ser vazio.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const query = `
            INSERT INTO chat_mensagens (sessao_id, remetente_id, conteudo)
            VALUES ($1, $2, $3)
            RETURNING id, sessao_id as "sessionId", remetente_id as "senderId", conteudo as "content", created_at as "timestamp";
        `;
        const { rows } = await client.query(query, [sessionId, remetenteId, content]);

        // Atualiza a data do último contato na sessão para ordenação
        await client.query('UPDATE chat_sessoes SET ultimo_contato = CURRENT_TIMESTAMP WHERE id = $1', [sessionId]);

        await client.query('COMMIT');
        res.status(201).json(rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Erro ao enviar mensagem:", error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    } finally {
        client.release();
    }
};