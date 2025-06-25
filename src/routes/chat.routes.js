// src/routes/chat.routes.js (Versão Corrigida)
const { Router } = require('express');
const chatController = require('../controllers/chat.controller');

// Correção: Importamos o middleware diretamente, sem as chaves {}.
const checkAuth = require('../middlewares/checkAuth');

const router = Router();

// Usa o middleware de autenticação para TODAS as rotas de chat.
// Isso garante que apenas usuários logados possam acessar qualquer funcionalidade de chat.
router.use(checkAuth);

// Define as rotas específicas do chat
router.get('/sessoes', chatController.getChatSessions);
router.get('/sessoes/:sessionId/mensagens', chatController.getMessagesForSession);
router.post('/sessoes/:sessionId/mensagens', chatController.sendMessage);
router.post('/sessoes', chatController.startOrGetChatSession); // Rota para iniciar uma nova conversa

module.exports = router;