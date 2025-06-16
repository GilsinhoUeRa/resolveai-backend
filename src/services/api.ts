// src/services/api.ts
import axios from 'axios';
import { ProviderDetails } from '@/types'; // Certifique-se que você tem este tipo definido

// Cria uma instância do Axios com a URL base da sua API
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', 
});

/**
 * Busca a lista de todos os serviços (que inclui dados dos prestadores)
 */
export const getServices = async (): Promise<ProviderDetails[]> => {
  // Faz a requisição GET para o endpoint /servicos do seu backend
  const { data } = await apiClient.get('/servicos'); 
  return data;
};