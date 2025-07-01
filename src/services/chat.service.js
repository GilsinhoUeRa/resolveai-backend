// src/services/chat.service.js
// ...
const getChatSessions = async (userId) => {
    return await db.selectFrom('chat_sessoes as cs')
        .innerJoin('chat_participantes as cp', 'cp.sessao_id', 'cs.id')
        .select(eb => [
            'cs.id',
            'cs.updated_at as updatedAt',
            // Subquery para buscar os detalhes do OUTRO participante
            jsonBuildObject({
                id: eb.selectFrom('usuarios as u')
                    .innerJoin('chat_participantes as cp2', 'cp2.usuario_id', 'u.id')
                    .where('cp2.sessao_id', '=', db.ref('cs.id'))
                    .where('cp2.usuario_id', '!=', userId)
                    .select('u.id').limit(1),
                nome: eb.selectFrom('usuarios as u')
                    // ... (lógica similar para nome)
                    .select('u.nome').limit(1),
                foto_url: eb.selectFrom('usuarios as u')
                    // ... (lógica similar para foto_url)
                    .select('u.foto_url').limit(1)
            }).as('otherParticipant'),
            // Subquery para buscar a última mensagem
            jsonBuildObject({
                // ... sua lógica de lastMessage ...
            }).as('lastMessage')
        ])
        .where('cp.usuario_id', '=', userId)
        .orderBy('cs.updated_at', 'desc')
        .execute();
};
// ...