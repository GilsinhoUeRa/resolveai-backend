// src/controllers/usuarios.controller.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { cpf, cnpj } = require('cpf-cnpj-validator');

// C - Create
exports.createUser = async (req, res) => {
    const { nome, email, senha, tipo_pessoa, documento } = req.body;
    
    if (!tipo_pessoa || !documento || !nome || !email || !senha) {
        return res.status(400).json({ erro: "Todos os campos (nome, email, senha, tipo_pessoa, documento) são obrigatórios." });
    }

    const documentoLimpo = documento.replace(/\D/g, '');

    if ((tipo_pessoa === 'PF' && !cpf.isValid(documentoLimpo)) || (tipo_pessoa === 'PJ' && !cnpj.isValid(documentoLimpo))) {
        return res.status(400).json({ erro: "CPF ou CNPJ inválido." });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        const query = `
            INSERT INTO usuarios (nome, email, senha, tipo_pessoa, documento) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, nome, email, tipo_pessoa, documento, role, created_at`;
            
        const { rows } = await pool.query(query, [nome, email, hashSenha, tipo_pessoa, documentoLimpo]);
        res.status(201).json(rows[0]);
    } catch (erro) {
        if (erro.code === '23505') { // unique_violation
            return res.status(409).json({ erro: 'Este documento ou email já está cadastrado.' });
        }
        console.error('Erro ao criar usuário:', erro);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// R - Read (All)
exports.getAllUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, role, created_at FROM usuarios ORDER BY id ASC');
        res.status(200).json(rows);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// Nova função para buscar os dados do próprio usuário logado
exports.getMe = async (req, res) => {
  // O middleware `checkAuth` já validou o token e adicionou `req.user`.
  const userId = req.user.id;

  try {
    const query = 'SELECT id, nome, email, tipo_usuario as "userType", foto_url as "photoUrl", cidade FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// R - Read (Self - /me)
exports.getMe = async (req, res) => {
    // Assumindo que o middleware checkAuth adiciona o ID do usuário em req.usuarioId
    // ou informações do usuário em req.user.id
    const usuarioId = req.usuarioId; // Ou req.user.id, dependendo da sua implementação do checkAuth

    if (!usuarioId) {
        return res.status(400).json({ erro: "ID do usuário não encontrado na requisição. O token é válido?" });
    }

    try {
        const { rows } = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, role, created_at FROM usuarios WHERE id = $1', [usuarioId]);
        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (erro) {
        console.error('Erro ao buscar dados do usuário (getMe):', erro);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// R - Read (Specific by ID)
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        // Query corrigida para também buscar a role
        const { rows } = await pool.query('SELECT id, nome, email, tipo_pessoa, documento, role, created_at FROM usuarios WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// U - Update
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nome, email, tipo_pessoa, documento } = req.body;
    try {
        // A query de update agora usa COALESCE para usar o valor existente se um novo não for fornecido
        const queryUpdate = `
            UPDATE usuarios 
            SET 
                nome = COALESCE($1, nome), 
                email = COALESCE($2, email), 
                tipo_pessoa = COALESCE($3, tipo_pessoa), 
                documento = COALESCE($4, documento)
            WHERE id = $5 
            RETURNING id, nome, email, tipo_pessoa, documento`;
            
        const valores = [nome, email, tipo_pessoa, documento, id];
        const { rows } = await pool.query(queryUpdate, valores);

        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado para atualizar' });
        }
        res.status(200).json(rows[0]);
    } catch (erro) {
        console.error(erro.message);
        if (erro.code === '23505') {
            return res.status(409).json({ erro: 'O email ou documento fornecido já pertence a outro usuário.' });
        }
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// D - Delete
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        res.status(204).send(); // 204 No Content é o status correto para um delete bem-sucedido
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

// Adiciona um prestador aos favoritos de um cliente
exports.addFavorite = async (req, res) => {
    // O ID do cliente vem do token (req.user.id)
    // O ID do prestador vem do corpo da requisição
    const clienteId = req.user.id;
    const { prestadorId } = req.body;

    if (!prestadorId) {
        return res.status(400).json({ erro: 'O ID do prestador é obrigatório.' });
    }

    try {
        await pool.query(
            'INSERT INTO favoritos (cliente_id, prestador_id) VALUES ($1, $2)',
            [clienteId, prestadorId]
        );
        res.status(201).json({ mensagem: 'Prestador favoritado com sucesso!' });
    } catch (error) {
        // Trata o caso de já ser favorito (violação de chave primária)
        if (error.code === '23505') {
            return res.status(409).json({ erro: 'Este prestador já está nos seus favoritos.' });
        }
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

// Remove um prestador dos favoritos de um cliente
exports.removeFavorite = async (req, res) => {
    const clienteId = req.user.id;
    const { prestadorId } = req.params; // O ID do prestador vem da URL

    try {
        const result = await pool.query(
            'DELETE FROM favoritos WHERE cliente_id = $1 AND prestador_id = $2',
            [clienteId, prestadorId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ erro: 'Favorito não encontrado para este usuário.' });
        }
        res.status(200).json({ mensagem: 'Prestador removido dos favoritos.' });
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

// Busca todos os IDs de prestadores favoritados por um cliente
exports.getFavorites = async (req, res) => {
    const clienteId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT prestador_id FROM favoritos WHERE cliente_id = $1',
            [clienteId]
        );
        // Retorna um array de IDs para ser fácil de usar no frontend
        const favoriteIds = result.rows.map(row => row.prestador_id);
        res.status(200).json(favoriteIds);
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

exports.updateProfilePhoto = async (req, res) => {
  // O middleware 'upload' anexa o arquivo a 'req.file'
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
  }

  // Por enquanto, apenas confirmamos que recebemos o arquivo.
  // A integração com um serviço de nuvem (como Cloudinary) virá depois.
  console.log('Arquivo recebido:', req.file);
  
  res.status(200).json({ 
    mensagem: 'Foto recebida com sucesso! Próximo passo: salvar na nuvem.',
    fileInfo: {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
  });
};