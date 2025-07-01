// src/services/admin.service.js
const db = require('../config/kysely');

const getDashboardStats = async () => {
    // Usamos Promise.all para executar todas as contagens em paralelo, o que é mais eficiente.
    const [
        userStats,
        professionCount,
        specialtyCount,
        categoryCount
    ] = await Promise.all([
        db.selectFrom('usuarios').select([
            db.fn.count('id').as('totalUsers'),
            db.fn.count('id').filterWhere('role', '=', 'PRESTADOR').as('totalProviders')
        ]).executeTakeFirst(),
        db.selectFrom('profissoes').select(db.fn.count('id').as('count')).executeTakeFirst(),
        db.selectFrom('especialidades').select(db.fn.count('id').as('count')).executeTakeFirst(),
        db.selectFrom('categorias').select(db.fn.count('id').as('count')).executeTakeFirst(),
    ]);

    return {
        totalUsers: Number(userStats.totalUsers),
        totalProviders: Number(userStats.totalProviders),
        totalProfessions: Number(professionCount.count),
        totalSpecialties: Number(specialtyCount.count),
        totalCategories: Number(categoryCount.count),
    };
};

module.exports = { getDashboardStats };