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
 * Lida com o callback do Google OAuth após uma tentativa de login bem-sucedida.
 * Gera o nosso JWT interno e redireciona o utilizador de volta para o frontend.
 */
exports.googleCallback = (req, res) => {
    // O middleware do Passport.js, após a autenticação bem-sucedida,
    // anexa o objeto 'user' (retornado pela nossa função 'done') ao 'req'.
    try {
        const token = jwt.sign(
            { userId: req.user.id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Redireciona para um URL específico no nosso frontend, passando o token como um parâmetro de busca.
        // O frontend será responsável por ler este parâmetro e guardar o token.
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);

    } catch (error) {
        // Em caso de falha na geração do JWT, redireciona para a página de login com um erro.
        console.error("Erro ao gerar token JWT após o callback do Google:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
};