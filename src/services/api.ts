import type { Character, RickMortyPaginatedResponse } from '@/types/rickMorty';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function getCharacters() {
  const data = await requestJson<RickMortyPaginatedResponse<Character>>(
    `${API_BASE_URL}/character`
  );

  return data.results;
}
