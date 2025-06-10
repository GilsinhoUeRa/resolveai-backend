// src/config/database.js
require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Se estiver em produção, usa a URL do Render. Senão, usa as variáveis locais.
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: isProduction ? connectionString : undefined,
  user: isProduction ? undefined : 'postgres',
  host: isProduction ? undefined : 'localhost',
  database: isProduction ? undefined : 'resolveai_db',
  password: isProduction ? undefined : process.env.DB_PASSWORD,
  port: isProduction ? undefined : 5432,
  // O Render exige conexões SSL em produção
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

module.exports = pool;// Exporta o pool para ser usado em outros arquivos