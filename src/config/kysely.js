// src/config/kysely.js
const { Kysely, PostgresDialect } = require('kysely');
const pool = require('./database');

const dialect = new PostgresDialect({
    pool
});

// O comentário JSDoc abaixo é a chave. Ele informa ao editor e ao TypeScript
// sobre a estrutura do nosso banco de dados, ativando o autocompletar e a segurança de tipos.
/** @type {import('kysely').Kysely<import('../types/database.types').Database>} */
const db = new Kysely({
    dialect,
});

module.exports = db;