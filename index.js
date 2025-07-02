// index.js
require('dotenv').config();
const http = require('http'); // Importa o módulo HTTP nativo do Node
const { Server } = require("socket.io"); // Importa o Server do socket.io
const app = require('./src/app'); // Importa a sua aplicação Express

const server = http.createServer(app); // Cria um servidor HTTP usando o Express

// Inicia o Socket.io anexado ao servidor HTTP
const io = new Server(server, {
    cors: {
        origin: "*", // Em produção, restrinja ao seu domínio do frontend
        methods: ["GET", "POST"]
    }
});

// Lógica do Socket.io
io.on('connection', (socket) => {
    console.log('Um utilizador conectou-se:', socket.id);

    socket.on('joinRoom', (sessionId) => {
        socket.join(sessionId);
        console.log(`Utilizador ${socket.id} entrou na sala ${sessionId}`);
    });

    socket.on('sendMessage', async (data) => {
        // TODO: Aqui você chamaria um serviço para guardar a 'data' (mensagem) na base de dados.
        // Após guardar, a mensagem retornada da base de dados (com ID e timestamp) é enviada.
        const newMessage = { ...data, id: Date.now(), timestamp: new Date().toISOString() }; // Simulação

        // Envia a nova mensagem para todos na mesma sala (sessionId)
        io.to(data.sessionId).emit('receiveMessage', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('Utilizador desconectou-se:', socket.id);
    });
});

const port = process.env.PORT || 3001;
// Inicia o servidor HTTP, que agora também "ouve" as conexões do Socket.io
server.listen(port, () => {
    console.log(`Servidor a correr na porta ${port}`);
});