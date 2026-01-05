export type CharacterStatus = 'Alive' | 'Dead' | 'unknown' | (string & {});

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  image: string;
}

export interface RickMortyPageInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RickMortyPaginatedResponse<T> {
  info: RickMortyPageInfo;
  results: T[];
}
