// tests/auth.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app'; // Importamos nossa instância do Express

// Descreve o conjunto de testes para a rota de autenticação
describe('POST /api/login', () => {

    // O 'it' descreve um caso de teste específico
    it('deve retornar um token JWT para credenciais válidas', async () => {
        // AÇÃO NECESSÁRIA: Substitua com um email e senha de um usuário REAL 
        // que exista no seu banco de dados de DESENVOLVIMENTO.
        const credentials = {
            email: 'final.test@resolveai.com',
            senha: 'Testando@321'
        };

        const response = await request(app)
            .post('/api/login') // Faz a requisição POST
            .send(credentials) // Envia os dados no corpo
            .set('Accept', 'application/json');

        // Verificamos se a resposta foi bem-sucedida (status 200)
        expect(response.statusCode).toBe(200);

        // Verificamos se o corpo da resposta contém uma propriedade chamada 'token'
        expect(response.body).toHaveProperty('token');

        // Verificamos se o token não é nulo ou vazio
        expect(response.body.token).not.toBeNull();
    });

    it('deve retornar erro 401 para credenciais inválidas', async () => {
        const invalidCredentials = {
            email: 'usuario.teste@exemplo.com',
            senha: 'senha_errada'
        };

        const response = await request(app)
            .post('/api/login')
            .send(invalidCredentials)
            .set('Accept', 'application/json');

        // Verificamos se a resposta foi de não autorizado (status 401)
        expect(response.statusCode).toBe(401);

        // Verificamos se o corpo da resposta contém a mensagem de erro esperada
        expect(response.body).toHaveProperty('erro', 'Credenciais inválidas');
    });
});