// src/app.js (Versão Final e Validada)

const express = require('express');
const cors = require('cors');
const passport = require('passport');

// Executa o ficheiro de configuração do Passport para que a estratégia do Google seja registada
require('./config/passport.config.js');

const app = express();

// --- Configuração de Middlewares Globais ---

// Configuração explícita de CORS para aceitar pedidos do seu frontend em desenvolvimento

// 1. Crie uma lista de origens permitidas
const whitelist = [
    'http://localhost:5173', // Para desenvolvimento local
    'https://resolveai-test.vercel.app' // Para o seu ambiente de produção/teste
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permite pedidos sem origem (como do Postman/Insomnia) ou se a origem estiver na whitelist
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pela política de CORS'));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware essencial para interpretar corpos de requisição em formato JSON
app.use(express.json());

// Inicializa o Passport para ser utilizado nas rotas de autenticação
app.use(passport.initialize());

// --- Importação dos Módulos de Rotas ---
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const servicosRoutes = require('./routes/servicos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const profissoesRoutes = require('./routes/profissoes.routes');
const especialidadesRoutes = require('./routes/especialidades.routes');
const prestadoresRoutes = require('./routes/prestadores.routes');
const adminRoutes = require('./routes/admin.routes');
const chatRoutes = require('./routes/chat.routes');

// --- Registo dos Roteadores com Prefixos de API ---
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/profissoes', profissoesRoutes);
app.use('/api/prestadores', prestadoresRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Rota raiz para verificação de status
app.get('/', (req, res) => {
  res.send('API do ResolveAi está no ar!');
});

module.exports = app;