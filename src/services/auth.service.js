// src/services/auth.service.js
const db = require('../config/kysely'); // Usamos a instância do Kysely
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (email, senha) => {
    // A sintaxe do Kysely é fluente e type-safe
    const usuario = await db
        .selectFrom('usuarios')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst(); // executa a query e pega o primeiro resultado

    if (!usuario) {
        const error = new Error('Credenciais inválidas');
        error.statusCode = 401;
        throw error;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        const error = new Error('Credenciais inválidas');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { userId: usuario.id, role: usuario.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token };
};

module.exports = {
    login,
};