// index.js (Versão Final com Socket.io)
require('dotenv').config();
const http = require('http'); // 1. Importa o módulo HTTP nativo do Node
const { Server } = require("socket.io"); // 2. Importa o Server do socket.io
const app = require('./src/app'); // 3. Importa a sua aplicação Express

// 4. Cria um servidor HTTP nativo usando a sua aplicação Express como handler de pedidos
const server = http.createServer(app);

// 5. Inicia o Socket.io e anexa-o ao servidor HTTP
const io = new Server(server, {
    cors: {
        origin: "*", // Em produção, restrinja isto ao URL do seu frontend para segurança
        methods: ["GET", "POST"]
    }
});

// 6. Define a lógica para os eventos do Socket.io
io.on('connection', (socket) => {
    console.log('Um utilizador conectou-se via WebSocket:', socket.id);

    socket.on('joinRoom', (sessionId) => {
        socket.join(sessionId);
        console.log(`Utilizador ${socket.id} entrou na sala ${sessionId}`);
    });

    socket.on('sendMessage', async (data) => {
        // TODO: Chamar um serviço para guardar a mensagem na base de dados
        const newMessage = { ...data, id: Date.now().toString(), timestamp: new Date().toISOString() }; // Simulação

        // Envia a nova mensagem de volta para todos na sala
        io.to(data.sessionId).emit('receiveMessage', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('Utilizador desconectou-se:', socket.id);
    });
});

const port = process.env.PORT || 3001;

// 7. Inicia o servidor HTTP (que contém o Express e o Socket.io), e NÃO o app diretamente.
server.listen(port, () => {
    console.log(`Servidor a correr na porta ${port}, pronto para pedidos HTTP e WebSockets.`);
});