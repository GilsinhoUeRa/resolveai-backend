// src/services/usuarios.service.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');

// -- Funções de Criação e Leitura --

const create = async (userData) => {
    const { nome, email, senha, tipo_pessoa, documento } = userData;
    const documentoLimpo = documento.replace(/\D/g, '');
    const hashSenha = await bcrypt.hash(senha, 10);
    try {
        const query = `
            INSERT INTO usuarios (nome, email, senha, tipo_pessoa, documento) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, nome, email, tipo_pessoa, documento, role, created_at`;
        const { rows } = await pool.query(query, [nome, email, hashSenha, tipo_pessoa, documentoLimpo]);
        return rows[0];
    } catch (erro) {
        if (erro.code === '23505') {
            const customError = new Error('Este documento ou email já está cadastrado.');
            customError.statusCode = 409;
            throw customError;
        }
        throw erro;
    }
};

const getAll = async () => {
    const { rows } = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, role, created_at FROM usuarios ORDER BY id ASC');
    return rows;
};

const getById = async (userId) => {
    const { rows } = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, role, created_at FROM usuarios WHERE id = $1', [userId]);
    if (rows.length === 0) {
        const error = new Error('Usuário não encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return rows[0];
};

const getMe = async (userId) => {
    const query = `
        SELECT u.id, u.nome, u.email, u.role, u.tipo_pessoa, u.documento, u.foto_url,
               pp.bio, pp.whatsapp, pp.horario_atendimento
        FROM usuarios u
        LEFT JOIN perfis_profissionais pp ON u.id = pp.usuario_id
        WHERE u.id = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
        const error = new Error('Usuário não encontrado.');
        error.statusCode = 404;
        throw error;
    }
    return rows[0];
};

// -- Funções de Atualização e Deleção --

const update = async (targetUserId, updateData) => {
    const { nome, email } = updateData;
    try {
        const queryUpdate = `
            UPDATE usuarios 
            SET nome = COALESCE($1, nome), email = COALESCE($2, email)
            WHERE id = $3 
            RETURNING id, nome, email, tipo_pessoa, documento, role;
        `;
        const { rows } = await pool.query(queryUpdate, [nome, email, targetUserId]);
        if (rows.length === 0) {
            const error = new Error('Usuário não encontrado para atualizar.');
            error.statusCode = 404;
            throw error;
        }
        return rows[0];
    } catch (erro) {
        if (erro.code === '23505') {
            const customError = new Error('O email fornecido já pertence a outro usuário.');
            customError.statusCode = 409;
            throw customError;
        }
        throw erro;
    }
};

const deleteUser = async (userId) => {
    const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1', [userId]);
    if (resultado.rowCount === 0) {
        const error = new Error('Usuário não encontrado.');
        error.statusCode = 404;
        throw error;
    }
    // Retorna sucesso implícito, o controller cuidará do status 204
};

// -- Funções de Perfil de Prestador --

const becomeProvider = async (userId, providerData) => {
    const { bio, whatsapp, horario_atendimento } = providerData;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const perfilQuery = `
            INSERT INTO perfis_profissionais (usuario_id, bio, whatsapp, horario_atendimento)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (usuario_id) DO UPDATE 
            SET bio = EXCLUDED.bio, whatsapp = EXCLUDED.whatsapp, 
                horario_atendimento = EXCLUDED.horario_atendimento, atualizado_em = NOW();
        `;
        await client.query(perfilQuery, [userId, bio, whatsapp, horario_atendimento]);
        const usuarioQuery = `UPDATE usuarios SET role = 'PRESTADOR' WHERE id = $1`;
        await client.query(usuarioQuery, [userId]);
        await client.query('COMMIT');
        const resultadoFinal = await getMe(userId); // Reutiliza a função getMe
        return resultadoFinal;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error; // Lança o erro para o controller tratar
    } finally {
        client.release();
    }
};

const updatePhotoUrl = async (userId, photoUrl) => {
    const { rows } = await pool.query(
        'UPDATE usuarios SET foto_url = $1 WHERE id = $2 RETURNING id, foto_url',
        [photoUrl, userId]
    );
    if (rows.length === 0) {
        const error = new Error('Usuário não encontrado para atualizar a foto.');
        error.statusCode = 404;
        throw error;
    }
    return rows[0];
};

// Não esqueça de exportar a nova função no final do arquivo

module.exports = {
    create,
    getAll,
    getById,
    getMe,
    update,
    deleteUser,
	updatePhotoUrl,
    becomeProvider
};