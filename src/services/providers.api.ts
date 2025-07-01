// src/services/providers.api.ts
import apiClient from './api';
import { ProviderDetails } from '@/types';

export const getFeaturedProvidersApi = async (): Promise<ProviderDetails[]> => {
    const { data } = await apiClient.get('/prestadores/destaques');
    return data;
};