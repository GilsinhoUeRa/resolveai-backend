// src/middlewares/upload.middleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configura o SDK do Cloudinary com as credenciais do seu arquivo .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cria uma instância do motor de armazenamento do Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'resolveai_profiles', // Nome da pasta onde as imagens serão salvas no Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos de imagem permitidos
        // Opcional: transformação para padronizar as imagens (ex: 200x200 pixels)
        transformation: [{ width: 200, height: 200, crop: 'fill' }] 
    },
});

// Cria a instância do multer com o novo motor de armazenamento
const upload = multer({ storage: storage });

module.exports = upload;