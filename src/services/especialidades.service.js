// src/services/especialidades.service.js
const db = require('../config/kysely');

const getAll = async () => {
    return await db.selectFrom('especialidades').selectAll().orderBy('nome', 'asc').execute();
};

const create = async (nome) => {
    try {
        return await db.insertInto('especialidades')
            .values({ nome })
            .returningAll()
            .executeTakeFirstOrThrow();
    } catch (error) {
        if (error.code === '23505') { // unique_violation
            const customError = new Error('Uma especialidade com este nome já existe.');
            customError.statusCode = 409;
            throw customError;
        }
        throw error;
    }
};

const update = async (id, nome) => {
    return await db.updateTable('especialidades')
        .set({ nome })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
};

const deleteById = async (id) => {
    const result = await db.deleteFrom('especialidades')
        .where('id', '=', id)
        .executeTakeFirst();
    return result.numDeletedRows > 0;
};

module.exports = { getAll, create, update, deleteById };