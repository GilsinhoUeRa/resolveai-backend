// src/services/api.ts
import axios from 'axios';
import { ProviderDetails } from '@/types'; // Certifique-se que você tem este tipo definido
import { FavoritesContextType } from '@/types'; // Adicione ao import de tipos

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

// --- FUNÇÕES DE FAVORITOS ---

// Busca os IDs dos prestadores favoritados pelo usuário logado
export const getFavorites = async (): Promise<string[]> => {
  const { data } = await api.get('/usuarios/me/favoritos');
  return data;
};

// Adiciona um prestador aos favoritos
export const addFavoriteApi = async (prestadorId: string): Promise<any> => {
  const { data } = await api.post('/usuarios/me/favoritos', { prestadorId });
  return data;
};

// Remove um prestador dos favoritos
export const removeFavoriteApi = async (prestadorId: string): Promise<any> => {
  const { data } = await api.delete(`/usuarios/me/favoritos/${prestadorId}`);
  return data;
};