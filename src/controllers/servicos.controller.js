// src/controllers/servicos.controller.js
const pool = require('../config/database');

// C - Create
exports.createService = async (req, res) => {
    const { nome, descricao, preco, categorias } = req.body;
    const usuario_id = req.userData.userId;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryServico = "INSERT INTO servicos (nome, descricao, preco, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *";
        const novoServicoResult = await client.query(queryServico, [nome, descricao, preco, usuario_id]);
        const novoServico = novoServicoResult.rows[0];
        if (categorias && categorias.length > 0) {
            const queryAssociacao = "INSERT INTO servicos_categorias (servico_id, categoria_id) VALUES ($1, $2)";
            for (const categoria_id of categorias) {
                await client.query(queryAssociacao, [novoServico.id, categoria_id]);
            }
        }
        await client.query('COMMIT');
        res.status(201).json(novoServico);
    } catch (erro) {
        await client.query('ROLLBACK');
        console.error(erro.message);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    } finally {
        client.release();
    }
};

// R - Read (All) - Versão Final com Agregação de Avaliações
exports.getAllServices = async (req, res) => {
    const { q, categoria } = req.query;

    try {
        let queryValues = [];
        let whereClauses = [];

        // Query base agora une as 3 tabelas e prepara para agregação
        let baseQuery = `
            SELECT 
                s.id, 
                s.nome, 
                s.preco, 
                s.descricao, 
                u.nome AS nome_prestador,
                -- Calcula a média das notas, tratando o caso de não haver notas (COALESCE)
                -- e formata para 2 casas decimais (::numeric(10,2))
                COALESCE(AVG(a.nota), 0.0)::numeric(10,1) AS nota_media,
                -- Conta o número de avaliações para cada serviço
                COUNT(a.id) AS total_avaliacoes
            FROM 
                servicos s
            JOIN 
                usuarios u ON s.usuario_id = u.id
            LEFT JOIN 
                avaliacoes a ON s.id = a.servico_id
        `;
        
        if (categoria) {
            baseQuery += ` JOIN servicos_categorias sc ON s.id = sc.servico_id`;
            whereClauses.push(`sc.categoria_id = $${queryValues.length + 1}`);
            queryValues.push(categoria);
        }

        if (q) {
            whereClauses.push(`(s.nome ILIKE $${queryValues.length + 1} OR s.descricao ILIKE $${queryValues.length + 1})`);
            queryValues.push(`%${q}%`);
        }

        let finalQuery = baseQuery;
        if (whereClauses.length > 0) {
            finalQuery += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        // Agrupamos os resultados por serviço para que as funções AVG e COUNT funcionem corretamente
        finalQuery += ` GROUP BY s.id, u.nome`;
        finalQuery += ` ORDER BY nota_media DESC, total_avaliacoes DESC`;

        const resultado = await pool.query(finalQuery, queryValues);
        res.status(200).json(resultado.rows);

    } catch (erro) {
        console.error('Erro ao buscar serviços:', erro);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    }
};


// R - Read (Specific)
exports.getServiceById = async (req, res) => {
    // Lógica para buscar um serviço por ID, incluindo suas categorias (um desafio futuro!)
    // Por enquanto, vamos manter simples:
    const { id } = req.params;
    try {
        const resultado = await pool.query('SELECT * FROM servicos WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Serviço não encontrado' });
        }
        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    }
};

// U - Update
exports.updateService = async (req, res) => {
    const { id } = req.params; // ID do serviço a ser atualizado
    const { userId } = req.userData; // ID do usuário logado (do token)
    const { nome, descricao, preco } = req.body;

    try {
        const servicoExistente = await pool.query('SELECT * FROM servicos WHERE id = $1', [id]);

        if (servicoExistente.rows.length === 0) {
            return res.status(404).json({ erro: 'Serviço não encontrado' });
        }

        const servico = servicoExistente.rows[0];

        // --- NOVA VERIFICAÇÃO DE PROPRIEDADE ---
        if (servico.usuario_id !== userId) {
            return res.status(403).json({ erro: 'Acesso negado. Você não tem permissão para editar este serviço.' });
        }
        // --- FIM DA VERIFICAÇÃO ---

        const queryUpdate = `UPDATE servicos SET nome = $1, descricao = $2, preco = $3 WHERE id = $4 RETURNING *`;
        const valores = [
            nome || servico.nome,
            descricao || servico.descricao,
            preco || servico.preco,
            id
        ];
        const resultado = await pool.query(queryUpdate, valores);

        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao atualizar serviço:', erro);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    }
};

// D - Delete
exports.deleteService = async (req, res) => {
    const { id } = req.params; // ID do serviço a ser deletado
    const { userId } = req.userData; // ID do usuário logado (do token)

    try {
        const servicoExistente = await pool.query('SELECT * FROM servicos WHERE id = $1', [id]);

        if (servicoExistente.rows.length === 0) {
            // Se o serviço não existe, não há o que deletar.
            return res.status(404).json({ erro: 'Serviço não encontrado' });
        }

        // --- NOVA VERIFICAÇÃO DE PROPRIEDADE ---
        if (servicoExistente.rows[0].usuario_id !== userId) {
            return res.status(403).json({ erro: 'Acesso negado. Você não tem permissão para deletar este serviço.' });
        }
        // --- FIM DA VERIFICAÇÃO ---

        await pool.query('DELETE FROM servicos WHERE id = $1', [id]);
        
        res.status(204).send();

    } catch (erro) {
        console.error('Erro ao deletar serviço:', erro);
        res.status(500).json({ erro: 'Ocorreu um erro no servidor' });
    }
};