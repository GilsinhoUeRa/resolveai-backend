// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

// --- MIDDLEWARES GLOBAIS ---
app.use(cors());
app.use(express.json()); // <-- ADICIONE ESTA LINHA. É ESSENCIAL.

// Importando todos os roteadores
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const servicosRoutes = require('./routes/servicos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const profissoesRoutes = require('./routes/profissoes.routes');
const especialidadesRoutes = require('./routes/especialidades.routes');
const prestadoresRoutes = require('./routes/prestadores.routes');
const adminRoutes = require('./routes/admin.routes');

// Definindo os prefixos da API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/profissoes', profissoesRoutes);
app.use('/api/prestadores', prestadoresRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API do ResolveAi está no ar!');
});

module.exports = app;