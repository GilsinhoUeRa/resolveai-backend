// src/controllers/auth.controller.js

const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');

/**
 * Lida com o login tradicional via email e senha.
 */
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
        }
        const resultado = await authService.login(email, senha);
        res.status(200).json(resultado);
    } catch (erro) {
        const statusCode = erro.statusCode || 500;
        res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
    }
};

/**
 * Lida com o callback do Google OAuth após uma tentativa de login.
 * Redireciona para completar o registo se for um novo utilizador,
 * ou gera um JWT e redireciona para o callback do app se for um utilizador existente.
 */
exports.googleCallback = (req, res) => {
    try {
        if (req.user.isNew) {
            // Se o utilizador é novo, redireciona para a página de completar registo,
            // passando os dados do Google como parâmetros de busca.
            const queryParams = new URLSearchParams({
                email: req.user.email,
                nome: req.user.nome,
                foto_url: req.user.foto_url
            }).toString();
            res.redirect(`${process.env.FRONTEND_URL}/complete-registration?${queryParams}`);
        } else {
            // --- CORREÇÃO APLICADA AQUI ---
            // Se o utilizador já existe, gera o token com todos os argumentos corretos.
            const token = jwt.sign(
                { userId: req.user.id, role: req.user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            // --- FIM DA CORREÇÃO ---

            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
        }
    } catch (error) {
        console.error("Erro no callback do Google:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_callback_failed`);
    }
};