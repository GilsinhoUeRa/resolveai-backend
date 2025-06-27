// src/controllers/usuarios.controller.js

// O controller importa apenas o serviço. Ele não sabe sobre o banco de dados.
const usuariosService = require('../services/usuarios.service');

/**
 * Função auxiliar para tratar erros de forma padronizada nos controllers.
 * @param {object} res - O objeto de resposta do Express.
 * @param {Error} erro - O objeto de erro capturado.
 */
const handleControllerError = (res, erro) => {
    console.error('Erro no controller:', erro.message);
    const statusCode = erro.statusCode || 500;
    res.status(statusCode).json({ erro: erro.message || 'Erro interno do servidor.' });
};

exports.createUser = async (req, res) => {
    try {
        const novoUsuario = await usuariosService.create(req.body);
        res.status(201).json(novoUsuario);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const usuarios = await usuariosService.getAll();
        res.status(200).json(usuarios);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.getMe = async (req, res) => {
    try {
        const usuario = await usuariosService.getMe(req.user.id);
        res.status(200).json(usuario);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const usuario = await usuariosService.getById(req.params.id);
        res.status(200).json(usuario);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id: targetUserId } = req.params;
        const { id: requesterId, role: requesterRole } = req.user;

        if (requesterId !== parseInt(targetUserId) && requesterRole !== 'ADMIN') {
            return res.status(403).json({ erro: 'Acesso negado. Você não tem permissão para atualizar este usuário.' });
        }

        const usuarioAtualizado = await usuariosService.update(targetUserId, req.body);
        res.status(200).json(usuarioAtualizado);
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await usuariosService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.becomeProvider = async (req, res) => {
    try {
        const usuarioAtualizado = await usuariosService.becomeProvider(req.user.id, req.body);
        res.status(200).json({
            mensagem: 'Perfil de prestador ativado com sucesso!',
            usuario: usuarioAtualizado
        });
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

exports.updateProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ erro: 'Nenhum arquivo de imagem enviado.' });
        }
        const photoUrl = req.file.path;
        const userId = req.user.id;

        const updatedUser = await usuariosService.updatePhotoUrl(userId, photoUrl);

        res.status(200).json({
            mensagem: 'Foto de perfil atualizada com sucesso!',
            foto_url: updatedUser.foto_url,
        });
    } catch (erro) {
        handleControllerError(res, erro);
    }
};

// As funções de favoritos seguiriam o mesmo padrão de refatoração para o service.
// Manterei o código antigo aqui para não quebrar a funcionalidade atual,
// mas a migração para o service é o próximo passo para elas.
exports.addFavorite = async (req, res) => {
    // LÓGICA A SER MOVIDA PARA O SERVICE
    const clienteId = req.user.id;
    const { prestadorId } = req.body;
    if (!prestadorId) { return res.status(400).json({ erro: 'O ID do prestador é obrigatório.' });}
    try {
        const pool = require('../config/database');
        await pool.query('INSERT INTO favoritos (cliente_id, prestador_id) VALUES ($1, $2)',[clienteId, prestadorId]);
        res.status(201).json({ mensagem: 'Prestador favoritado com sucesso!' });
    } catch (error) {
        if (error.code === '23505') { return res.status(409).json({ erro: 'Este prestador já está nos seus favoritos.' }); }
        handleControllerError(res, error);
    }
};
exports.removeFavorite = async (req, res) => {
    // LÓGICA A SER MOVIDA PARA O SERVICE
    const clienteId = req.user.id;
    const { prestadorId } = req.params;
    try {
        const pool = require('../config/database');
        const result = await pool.query('DELETE FROM favoritos WHERE cliente_id = $1 AND prestador_id = $2', [clienteId, prestadorId]);
        if (result.rowCount === 0) { return res.status(404).json({ erro: 'Favorito não encontrado para este usuário.' }); }
        res.status(200).json({ mensagem: 'Prestador removido dos favoritos.' });
    } catch (error) {
        handleControllerError(res, error);
    }
};
exports.getFavorites = async (req, res) => {
    // LÓGICA A SER MOVIDA PARA O SERVICE
    const clienteId = req.user.id;
    try {
        const pool = require('../config/database');
        const result = await pool.query('SELECT prestador_id FROM favoritos WHERE cliente_id = $1', [clienteId]);
        const favoriteIds = result.rows.map(row => row.prestador_id);
        res.status(200).json(favoriteIds);
    } catch (error) {
        handleControllerError(res, error);
    }
};