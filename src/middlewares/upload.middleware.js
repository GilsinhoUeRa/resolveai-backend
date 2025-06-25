// src/middlewares/upload.middleware.js
const multer = require('multer');

// Configura o multer para armazenar o arquivo em memória como um Buffer
const storage = multer.memoryStorage();

// Cria a instância do multer com a configuração de armazenamento
const upload = multer({ storage: storage });

module.exports = upload;