// src/middlewares/checkAuth.js
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  // 1. Verificamos se o cabeçalho de autorização existe e está no formato correto.
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação não fornecido ou em formato inválido.' });
  }

  try {
    // 2. Extraímos o token de forma segura.
    const token = req.headers.authorization.split(' ')[1];
    
    // 3. Verificamos o token com o segredo do .env.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Anexamos os dados completos (id e role) ao objeto req.user.
    // Isso é crucial para o próximo middleware (checkRole).
    req.user = {
      id: decodedToken.userId,
      role: decodedToken.role
    };
    
    next(); // Tudo certo, pode passar para o próximo middleware ou para o controller.
    
  } catch (error) {
    // Se jwt.verify falhar (token inválido, expirado), este erro é acionado.
    return res.status(401).json({ erro: 'Autenticação falhou. Token inválido ou expirado.' });
  }
};

module.exports = checkAuth;