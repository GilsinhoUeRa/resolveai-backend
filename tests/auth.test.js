// tests/auth.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app'; // Importamos nossa instância do Express

// Descreve o conjunto de testes para a rota de autenticação
describe('POST /api/auth/login', () => {

    // O 'it' descreve um caso de teste específico
    it('deve retornar um token JWT para credenciais válidas', async () => {
        // AÇÃO NECESSÁRIA: Garanta que este usuário e senha existam no seu banco de dados de DESENVOLVIMENTO.
        const credentials = {
            email: 'final.test@resolveai.com',
            senha: 'Testando@321'
        };

        // --- CORREÇÃO APLICADA AQUI ---
        // A chamada agora é uma única cadeia de métodos, sem duplicação.
        const response = await request(app)
            .post('/api/auth/login')
            .send(credentials)
            .set('Accept', 'application/json');

        // Se a resposta não for 200, imprime o corpo do erro para análise
        if (response.statusCode !== 200) {
            console.error('RESPOSTA DE ERRO RECEBIDA DO SERVIDOR:', response.body);
        }
        // --- FIM DA CORREÇÃO ---

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
            .post('/api/auth/login')
            .send(invalidCredentials)
            .set('Accept', 'application/json');
        
        if (response.statusCode !== 401) {
            console.error('RESPOSTA INESPERADA (INVÁLIDA) DO SERVIDOR:', response.body);
        }

        // Verificamos se a resposta foi de não autorizado (status 401)
        expect(response.statusCode).toBe(401);

        // Verificamos se o corpo da resposta contém a mensagem de erro esperada
        expect(response.body).toHaveProperty('erro', 'Credenciais inválidas');
    });
});