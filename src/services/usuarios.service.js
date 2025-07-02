// src/services/usuarios.service.js (Versão Final 100% Kysely)
const db = require('../config/kysely');
const bcrypt = require('bcrypt');

const create = async (userData) => {
    const { nome, email, senha, tipo_pessoa, documento, cep, logradouro, bairro, cidade, uf, numero, complemento } = userData;
    const hashSenha = await bcrypt.hash(senha, 10);
    try {
        return await db.insertInto('usuarios').values({
            nome, email, senha: hashSenha, tipo_pessoa, documento, cep, logradouro, numero, complemento, bairro, cidade, uf,
        }).returningAll().executeTakeFirstOrThrow();
    } catch (error) {
        if (error.code === '23505') {
            const customError = new Error('Um utilizador com este email ou documento já existe.');
            customError.statusCode = 409;
            throw customError;
        }
        throw error;
    }
};

const getAll = async () => {
    return await db.selectFrom('usuarios')
        .select(['id', 'nome', 'email', 'role', 'cidade', 'uf', 'isActive'])
        .orderBy('id', 'asc')
        .execute();
};

const getById = async (userId) => {
    return await db.selectFrom('usuarios')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();
};

const getMe = async (userId) => {
    return await db.selectFrom('usuarios as u')
        .leftJoin('perfis_profissionais as pp', 'pp.usuario_id', 'u.id')
        .selectAll('u')
        .select(['pp.bio', 'pp.whatsapp', 'pp.horario_atendimento'])
        .where('u.id', '=', userId)
        .executeTakeFirst();
};

const update = async (targetUserId, updateData) => {
    // Kysely ignora campos 'undefined', então não precisamos do COALESCE
    return await db.updateTable('usuarios')
        .set(updateData)
        .where('id', '=', targetUserId)
        .returning(['id', 'nome', 'email', 'role'])
        .executeTakeFirst();
};

const deleteUser = async (userId) => {
    const result = await db.deleteFrom('usuarios')
        .where('id', '=', userId)
        .executeTakeFirst();
    return result.numDeletedRows > 0;
};

const becomeProvider = async (userId, providerData) => {
    const { bio, whatsapp, horario_atendimento } = providerData;

    return await db.transaction().execute(async (trx) => {
        // Usa a transação (trx) para todas as queries dentro deste bloco
        await trx.insertInto('perfis_profissionais')
            .values({ usuario_id: userId, bio, whatsapp, horario_atendimento })
            .onConflict(oc => oc.column('usuario_id').doUpdateSet({ bio, whatsapp, horario_atendimento }))
            .execute();
            
        await trx.updateTable('usuarios')
            .set({ role: 'PRESTADOR' })
            .where('id', '=', userId)
            .execute();

        // Reutiliza a função getMe, mas dentro da transação se necessário
        // ou chama diretamente após o commit da transação.
        // Para simplicidade, vamos buscar fora após o sucesso.
    });
};

const updatePhotoUrl = async (userId, photoUrl) => {
    return await db.updateTable('usuarios')
        .set({ foto_url: photoUrl })
        .where('id', '=', userId)
        .returning(['id', 'foto_url'])
        .executeTakeFirst();
};

const getFeaturedProviders = async () => {
    return await db.selectFrom('usuarios as u')
        .innerJoin('perfis_profissionais as pp', 'pp.usuario_id', 'u.id')
        .leftJoin('profissoes as p', 'u.profissao_id', 'p.id')
        .select([
            'u.id', 'u.nome', 'u.cidade', 'u.foto_url',
            'p.nome as profession_name', 'pp.bio'
        ])
        .where('u.role', '=', 'PRESTADOR')
        .where('u.isActive', '=', true)
        .orderBy(db.fn.random())
        .limit(4)
        .execute();
};

const getFavoriteProviders = async (clienteId) => {
    return await db.selectFrom('favoritos as f')
        .innerJoin('usuarios as u', 'u.id', 'f.prestador_id')
        .leftJoin('profissoes as p', 'u.profissao_id', 'p.id')
        .select([
            'u.id', 'u.nome', 'u.email', 'u.cidade', 'u.foto_url',
            'p.nome as profession_name'
        ])
        .where('f.cliente_id', '=', clienteId)
        .execute();
};

module.exports = {
    create,
    getAll,
    getById,
    getMe,
    update,
    deleteUser,
    updatePhotoUrl,
    becomeProvider,
    getFeaturedProviders,
    getFavoriteProviders
};