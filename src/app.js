// src/app.js
const express = require('express');
const cors = require('cors'); // 1. Importa a biblioteca
const app = express();

// --- Middlewares ---
app.use(cors()); // 2. Usa o middleware. Deve vir antes das suas rotas!
app.use(express.json());
// Adicione o CORS aqui se for consumir a API de um frontend em domínio diferente
// const cors = require('cors');
// app.use(cors());

// Importando as rotas de usuários
const usuariosRoutes = require('./src/routes/usuarios.routes');
const servicosRoutes = require('./src/routes/servicos.routes');
const categoriasRoutes = require('./src/routes/categorias.routes');

// Definindo as Rotas de Usuários da API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/categorias', categoriasRoutes);

// Importando as Rotas
const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/user.routes'); // Faremos em seguida

// Definindo as Rotas da API
app.use('/api', authRoutes); // Ex: /api/login
// app.use('/api/usuarios', userRoutes); // Ex: /api/usuarios/

app.get('/', (req, res) => {
  res.send('API do ResolveAi está no ar e bem estruturada!');
});


module.exports = app;