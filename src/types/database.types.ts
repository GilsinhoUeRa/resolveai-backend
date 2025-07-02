// src/types/database.types.ts
import { Generated, ColumnType } from 'kysely';

// Interface principal que mapeia nomes de tabelas para seus tipos
export interface Database {
  usuarios: UsuariosTable;
  // Adicione outras tabelas aqui conforme as cria (ex: profissoes, categorias)
}

// Interface para a tabela 'usuarios'
// Os nomes das propriedades devem corresponder EXATAMENTE aos nomes das colunas no seu banco de dados.
export interface UsuariosTable {
  id: Generated<number>;
  nome: string;
  email: string;
  senha: string;
  tipo_pessoa: 'PF' | 'PJ';
  documento: string;
  role: 'CLIENTE' | 'PRESTADOR' | 'ADMIN';
  isActive: boolean;
  foto_url: string | null;
  profissao_id: number | null;
  cep: string | null;
  logradouro: string | null;
  bairro: string | null;
  cidade: string | null; // <-- ÚNICA DECLARAÇÃO CORRETA
  uf: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}