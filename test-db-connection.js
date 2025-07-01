// test-db-connection.js
require('dotenv').config(); // Carrega as variáveis do .env

// Importamos a pool de conexão exatamente como sua aplicação faz
const pool = require('./src/config/database');

console.log('Tentando conectar ao banco de dados...');
console.log('Host:', process.env.DB_HOST || 'localhost'); // Adicionado para depuração
console.log('Database:', process.env.DB_DATABASE || 'resolveai_db'); // Adicionado para depuração

async function testConnection() {
    let client;
    try {
        // Pega um cliente da pool. Se isso falhar, a conexão está com problemas.
        client = await pool.connect();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

        // Tenta fazer uma query simples
        const res = await client.query('SELECT NOW()');
        console.log('✅ Query executada com sucesso. Hora do servidor:', res.rows[0].now);

    } catch (error) {
        console.error('❌ FALHA NA CONEXÃO COM O BANCO DE DADOS:');
        console.error('Mensagem de Erro:', error.message);
        console.error('Stack Trace:', error.stack);
    } finally {
        // Garante que o cliente seja liberado de volta para a pool
        if (client) {
            client.release();
        }
        // Encerra a pool para que o script possa terminar
        pool.end();
    }
}

testConnection();