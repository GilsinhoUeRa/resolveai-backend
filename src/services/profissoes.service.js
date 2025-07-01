// src/services/profissoes.service.js
const db = require('../config/kysely'); // Importamos nossa instância do Kysely

/**
 * Busca todas as profissões no banco de dados, ordenadas por nome.
 * @returns {Promise<Array<object>>} Uma lista de profissões.
 */
const getAll = async () => {
    return await db.selectFrom('profissoes')
        .selectAll()
        .orderBy('nome', 'asc')
        .execute();
};

/**
 * Busca uma única profissão pelo seu ID.
 * @param {number} id - O ID da profissão.
 * @returns {Promise<object|undefined>} A profissão encontrada ou undefined.
 */
const getById = async (id) => {
    return await db.selectFrom('profissoes')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
};

/**
 * Cria uma nova profissão no banco de dados.
 * @param {object} professionData - Os dados da nova profissão ({ nome, descricao }).
 * @returns {Promise<object>} A profissão recém-criada.
 * @throws {Error} Lança um erro se o nome da profissão já existir.
 */
const create = async (professionData) => {
    const { nome, descricao } = professionData;
    try {
        return await db.insertInto('profissoes')
            .values({ nome, descricao })
            .returningAll()
            .executeTakeFirstOrThrow();
    } catch (error) {
        if (error.code === '23505') { // Erro de violação de chave única (unique_violation)
            const customError = new Error('Uma profissão com este nome já existe.');
            customError.statusCode = 409; // HTTP Status Code for Conflict
            throw customError;
        }
        throw error;
    }
};

/**
 * Atualiza uma profissão existente.
 * @param {number} id - O ID da profissão a ser atualizada.
 * @param {object} updateData - Os novos dados para a profissão ({ nome, descricao }).
 * @returns {Promise<object>} A profissão atualizada.
 */
const update = async (id, updateData) => {
    const { nome, descricao } = updateData;
    return await db.updateTable('profissoes')
        .set({ nome, descricao })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
};

/**
 * Deleta uma profissão pelo seu ID.
 * @param {number} id - O ID da profissão a ser deletada.
 * @returns {Promise<boolean>} True se a deleção foi bem-sucedida, false caso contrário.
 */
const deleteById = async (id) => {
    const result = await db.deleteFrom('profissoes')
        .where('id', '=', id)
        .executeTakeFirst();

    return result.numDeletedRows > 0;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
};