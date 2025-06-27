// src/config/kysely.js
const { Kysely, PostgresDialect } = require('kysely');
const pool = require('./database'); // Importamos nossa pool de conexão existente

// Criamos o "dialeto" que ensina o Kysely a falar com o PostgreSQL
const dialect = new PostgresDialect({
    pool: pool
});

// Criamos e exportamos a instância do Kysely que será nosso novo "cérebro" de banco de dados
const db = new Kysely({
    dialect,
});

module.exports = db;