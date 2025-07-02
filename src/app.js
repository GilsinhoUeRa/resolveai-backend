// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport'); // 1. Importar o Passport
require('./config/passport.config.js'); // 2. Importar a nossa configuração (isto executa o código do ficheiro)

// --- OPÇÕES DE CORS ---
// Isto diz ao nosso backend para aceitar explicitamente pedidos do nosso servidor de desenvolvimento do frontend
const corsOptions = {
    origin: 'http://localhost:5173', // A porta padrão do Vite. Mude se a sua for diferente.
    optionsSuccessStatus: 200
};

// --- MIDDLEWARES GLOBAIS ---
app.use(cors(corsOptions));
app.use(express.json()); // <-- ADICIONE ESTA LINHA. É ESSENCIAL.
app.use(passport.initialize()); // 3. Inicializar o Passport como middleware

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