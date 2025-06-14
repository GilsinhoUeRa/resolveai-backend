// src/controllers/auth.controller.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = resultado.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // --- CORREÇÃO APLICADA AQUI ---
    // Adicionamos a 'role' do usuário ao payload do token.
    const token = jwt.sign(
      { 
        userId: usuario.id, 
        role: usuario.role // <-- A INFORMAÇÃO CRUCIAL QUE FALTAVA
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.status(200).json({ token });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
  }
};

module.exports = exports;