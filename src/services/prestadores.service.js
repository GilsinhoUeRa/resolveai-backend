// src/services/prestadores.service.js
const db = require('../config/kysely'); // Importamos nossa instância do Kysely

/**
 * Busca 4 prestadores de serviço aleatórios para exibir como destaque.
 * Realiza os JOINs necessários para trazer dados completos para o ProviderCard.
 * @returns {Promise<Array<object>>} Uma lista com até 4 prestadores.
 */
const getFeaturedProviders = async () => {
    return await db.selectFrom('usuarios as u')
        .innerJoin('perfis_profissionais as pp', 'pp.usuario_id', 'u.id')
        .leftJoin('profissoes as p', 'u.profissao_id', 'p.id') // Usamos leftJoin para não quebrar se a profissão for nula
        .select([
            'u.id', 'u.nome', 'u.email', 'u.cidade', 'u.foto_url', 'u.role as userType',
            'pp.bio',
            'p.nome as profession_name'
            // Adicione aqui outros campos que o ProviderCard possa precisar
        ])
        .where('u.role', '=', 'PRESTADOR')
        .where('u.isActive', '=', true) // Garante que apenas prestadores ativos sejam mostrados
        .orderBy(db.fn.random()) // Para PostgreSQL. Se usar MySQL, substitua por RAND().
        .limit(4)
        .execute();
};

/**
 * Busca todos os prestadores (para a página de busca).
 * TODO: Implementar lógica de filtros (busca por nome, categoria, etc.)
 * @returns {Promise<Array<object>>} Uma lista de todos os prestadores.
 */
const getAllProviders = async () => {
    // Lógica futura de busca e filtragem
    return [];
};

/**
 * Busca os detalhes completos de um único prestador pelo ID.
 * TODO: Implementar a query detalhada para o perfil do prestador.
 * @param {number} id - O ID do prestador.
 * @returns {Promise<object|undefined>} O prestador encontrado ou undefined.
 */
const getProviderById = async (id) => {
    // Lógica futura para a página de perfil do prestador
    return null;
};


module.exports = {
    getFeaturedProviders,
    getAllProviders,
    getProviderById
};