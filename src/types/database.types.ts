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
  id: Generated<number>; // `Generated` informa ao Kysely que este campo é autoincrementado.
  nome: string;
  email: string;
  senha: string;
  tipo_pessoa: 'PF' | 'PJ';
  documento: string;
  role: 'CLIENTE' | 'PRESTADOR' | 'ADMIN';
  isActive: boolean;
  cidade: string | null; // | null se a coluna puder ser nula
  foto_url: string | null;
  profissao_id: number | null;
  // `ColumnType` é usado para colunas com tipos diferentes na leitura vs. inserção/atualização.
  created_at: ColumnType<Date, string | undefined, never>;
}