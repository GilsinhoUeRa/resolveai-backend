// src/services/auth.service.js (VERSÃO DE DEPURAÇÃO)
const db = require('../config/kysely');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (email, senha) => {
    const usuario = await db
        .selectFrom('usuarios')
        .select(['id', 'email', 'senha', 'role'])
        .where('email', '=', email)
        .executeTakeFirst();

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

module.exports = { login };