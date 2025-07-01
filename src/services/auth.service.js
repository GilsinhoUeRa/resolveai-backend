// src/services/auth.service.js (VERSÃO DE DEPURAÇÃO)
const db = require('../config/kysely');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (email, senha) => {
    console.log('[SERVICE] Iniciando serviço de login para email:', email);

    const usuario = await db
        .selectFrom('usuarios')
        .select(['id', 'email', 'senha', 'role'])
        .where('email', '=', email)
        .executeTakeFirst();

    console.log('[SERVICE] Resultado da query da base de dados:', usuario);

    if (!usuario) {
        console.log('[SERVICE] Conclusão: Utilizador não encontrado. A lançar erro 401.');
        const error = new Error('Credenciais inválidas');
        error.statusCode = 401;
        throw error;
    }

    // VERIFICAÇÃO CRÍTICA
    console.log('[SERVICE] Objeto "usuario" antes de comparar a senha:', JSON.stringify(usuario, null, 2));
    console.log('[SERVICE] Valor de "usuario.senha" a ser usado:', usuario.senha);
    console.log('[SERVICE] Valor da "senha" do formulário a ser usada:', senha);

    // Esta é a linha onde o erro "data and hash arguments required" acontece
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log('[SERVICE] Resultado do bcrypt.compare:', senhaValida);

    if (!senhaValida) {
        console.log('[SERVICE] Conclusão: Senha inválida. A lançar erro 401.');
        const error = new Error('Credenciais inválidas');
        error.statusCode = 401;
        throw error;
    }

    console.log('[SERVICE] Conclusão: Senha válida. A gerar token.');
    const token = jwt.sign(
        { userId: usuario.id, role: usuario.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token };
};

module.exports = { login };