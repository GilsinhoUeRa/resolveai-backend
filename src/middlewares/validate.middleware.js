// src/middlewares/validate.middleware.js
const { ZodError } = require('zod');

/**
 * Middleware de validação genérico usando Zod.
 * É uma função de ordem superior: você passa um schema e ela retorna
 * um middleware Express configurado com aquele schema.
 * @param {z.Schema} schema - O schema do Zod para validar a requisição.
 * @returns {Function} Um middleware Express.
 */
const validate = (schema) => (req, res, next) => {
    try {
        // 1. Tenta validar o corpo, os parâmetros e a query da requisição contra o schema.
        // O Zod lança um erro se a validação falhar.
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        
        // 2. Se a validação for bem-sucedida, a requisição segue para o controller.
        next();
    } catch (error) {
        // 3. Se a validação falhar, o Zod lança um erro do tipo ZodError.
        if (error instanceof ZodError) {
            // 4. Formata os erros de forma clara para o cliente da API.
            const errorMessages = error.errors.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));
            // Retorna um status 400 (Bad Request) com os detalhes do erro.
            return res.status(400).json({ 
                error: 'Entrada de dados inválida.', 
                details: errorMessages 
            });
        }
        // Para outros tipos de erro inesperados, retorna um erro de servidor.
        return res.status(500).json({ error: 'Erro interno do servidor durante a validação.' });
    }
};

module.exports = validate;