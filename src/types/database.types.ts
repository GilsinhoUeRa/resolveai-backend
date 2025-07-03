// src/types/database.types.ts
import { Generated, ColumnType } from 'kysely';

  // Adicione outras tabelas aqui conforme as cria (ex: profissoes, categorias)
// Nova interface para a tabela profissoes
export interface ProfissoesTable {
    id: Generated<number>;
    nome: string;
    descricao: string | null;
    created_at: ColumnType<Date, string | undefined, never>;
}

// Interface para perfis_profissionais
export interface PerfisProfissionaisTable {
    id: Generated<number>;
    usuario_id: number;
    bio: string | null;
    whatsapp: string | null;
    horario_atendimento: string | null;
    profissao_id: number | null; // <-- CAMPO ADICIONADO
    created_at: ColumnType<Date, string | undefined, never>;
    updated_at: ColumnType<Date, string | undefined, string | undefined>;
}

// Interface principal que mapeia nomes de tabelas para seus tipos
export interface Database {
  usuarios: UsuariosTable;
  perfis_profissionais: PerfisProfissionaisTable;
  profissoes: ProfissoesTable;

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
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null; // <-- ÚNICA DECLARAÇÃO CORRETA
  uf: string | null;
 
  created_at: ColumnType<Date, string | undefined, never>;
}