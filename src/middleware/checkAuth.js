// src/middleware/checkAuth.js
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Usando a variável de ambiente
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Autenticação falhou' });
  }
};

module.exports = checkAuth; // Exporta a função