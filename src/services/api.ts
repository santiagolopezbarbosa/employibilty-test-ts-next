import type { Character, RickMortyPaginatedResponse } from '@/types/rickMorty';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    if (response.status === 404) {
      // API de Rick Morty devuelve 404 cuando no hay coincidencias de busqueda.
      return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] } as any;
    }
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export interface FetchCharactersParams {
  page?: number;
  name?: string;
  status?: string;
}

export async function getCharacters({ page = 1, name = "", status = "" }: FetchCharactersParams = {}) {
  const searchParams = new URLSearchParams();
  searchParams.append('page', page.toString());
  
  if (name) searchParams.append('name', name);
  if (status && status !== 'all') searchParams.append('status', status);

  const data = await requestJson<RickMortyPaginatedResponse<Character>>(
    `${API_BASE_URL}/character/?${searchParams.toString()}`
  );

  return data; // Retornamos { info, results } completo para manejar la paginacion
}
