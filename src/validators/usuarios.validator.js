// src/validators/usuarios.validator.js
const { z } = require('zod');

// Schema para a criação de um novo usuário
const createUserSchema = z.object({
    body: z.object({
        nome: z.string({ required_error: 'O nome é obrigatório.' }).min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
        email: z.string({ required_error: 'O email é obrigatório.' }).email({ message: 'Formato de email inválido.' }),
        senha: z.string({ required_error: 'A senha é obrigatória.' }).min(6, { message: 'A senha precisa ter no mínimo 6 caracteres.' }),
        tipo_pessoa: z.enum(['PF', 'PJ'], { required_error: 'O tipo de pessoa (PF ou PJ) é obrigatório.' }),
        documento: z.string({ required_error: 'O documento é obrigatório.' }).regex(/^\d+$/, { message: 'O documento deve conter apenas números.' })
    })
});

module.exports = {
    createUserSchema
};