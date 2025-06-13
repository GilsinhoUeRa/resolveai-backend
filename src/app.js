// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Importando todos os roteadores
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const servicosRoutes = require('./routes/servicos.routes');
const categoriasRoutes = require('./routes/categorias.routes');

// Definindo os prefixos da API
app.use('/api', authRoutes); // /api/login
app.use('/api/usuarios', usuariosRoutes); // /api/usuarios, /api/usuarios/:id
app.use('/api/servicos', servicosRoutes); // /api/servicos, /api/servicos/:id, etc.
app.use('/api/categorias', categoriasRoutes); // /api/categorias

app.get('/', (req, res) => {
  res.send('API do ResolveAi está no ar!');
});

module.exports = app;