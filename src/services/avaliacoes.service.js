// src/services/avaliacoes.service.js
const db = require('../config/kysely');

/**
 * Cria uma nova avaliação para um serviço específico.
 * @param {number} servicoId - O ID do serviço que está sendo avaliado.
 * @param {number} clienteId - O ID do cliente que está fazendo a avaliação.
 * @param {object} reviewData - Os dados da avaliação ({ nota, comentario }).
 * @returns {Promise<object>} A avaliação recém-criada.
 */
const create = async (servicoId, clienteId, reviewData) => {
    const { nota, comentario } = reviewData;
    return await db.insertInto('avaliacoes')
        .values({
            servico_id: servicoId,
            cliente_id: clienteId,
            nota,
            comentario
        })
        .returningAll()
        .executeTakeFirstOrThrow();
};

/**
 * Busca todas as avaliações de um serviço específico.
 * Realiza um JOIN com a tabela de usuários para incluir nome e foto do cliente.
 * @param {number} servicoId - O ID do serviço.
 * @returns {Promise<Array<object>>} Uma lista de avaliações.
 */
const getByServiceId = async (servicoId) => {
    return await db.selectFrom('avaliacoes as a')
        .innerJoin('usuarios as u', 'u.id', 'a.cliente_id')
        .select([
            'a.id',
            'a.nota',
            'a.comentario',
            'a.created_at as date',
            'u.id as clientId',
            'u.nome as clientName',
            'u.foto_url as clientPhotoUrl'
        ])
        .where('a.servico_id', '=', servicoId)
        .orderBy('a.created_at', 'desc')
        .execute();
};

const getByClientId = async (clienteId) => {
    // A query faz o JOIN para já trazer os dados do prestador avaliado
    return await db.selectFrom('avaliacoes as a')
        .innerJoin('servicos as s', 's.id', 'a.servico_id')
        .innerJoin('usuarios as u', 'u.id', 's.usuario_id')
        .select([
            'a.id', 'a.nota', 'a.comentario', 'a.created_at as date', 
            'u.id as providerId', 'u.nome as providerName', 'u.foto_url as providerPhotoUrl'
        ])
        .where('a.cliente_id', '=', clienteId)
        .orderBy('a.created_at', 'desc')
        .execute();
};

module.exports = { create, getByServiceId, getByClientId }; // Exporte a nova função