// src/middlewares/checkRole.js
const pool = require('../config/database');

// Esta é uma função de ordem superior. Ela retorna a função de middleware.
// Isso nos permite passar quais papéis são permitidos (ex: checkRole(['PRESTADOR', 'ADMIN']))
const checkRole = (rolesPermitidas) => {
    return async (req, res, next) => {
        // Assumimos que checkAuth já rodou, então temos req.userData.userId
        const { userId } = req.userData;

        try {
            const resultado = await pool.query('SELECT role FROM usuarios WHERE id = $1', [userId]);

            if (resultado.rows.length === 0) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }

            const roleDoUsuario = resultado.rows[0].role;

            if (rolesPermitidas.includes(roleDoUsuario)) {
                next(); // O usuário tem o papel permitido, pode prosseguir.
            } else {
                // O usuário está autenticado, mas não tem permissão.
                return res.status(403).json({ erro: 'Acesso negado. Permissões insuficientes.' });
            }

        } catch (erro) {
            console.error('Erro na verificação de papel:', erro);
            return res.status(500).json({ erro: 'Erro interno do servidor.' });
        }
    };
};

module.exports = checkRole;