/**
 * Servicio de Favoritos — Comunicación con el Backend
 * 
 * Funciones tipadas para interactuar con /api/favorites
 */

export interface FavoriteCharacterResponse {
  id: number;
  apiCharacterId: number;
  characterName: string;
  characterImage: string;
  userId: number;
  createdAt: string;
}

interface AddFavoritePayload {
  apiCharacterId: number;
  characterName: string;
  characterImage: string;
}

/**
 * Obtener todos los personajes favoritos del usuario
 */
export async function getFavorites(): Promise<FavoriteCharacterResponse[]> {
  const response = await fetch('/api/favorites');

  if (!response.ok) {
    throw new Error('Error al obtener los favoritos');
  }

  return response.json() as Promise<FavoriteCharacterResponse[]>;
}

/**
 * Agregar un personaje a favoritos
 */
export async function addFavorite(
  payload: AddFavoritePayload
): Promise<FavoriteCharacterResponse> {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    throw new Error('Este personaje ya está en tus favoritos');
  }

  if (!response.ok) {
    throw new Error('Error al agregar a favoritos');
  }

  return response.json() as Promise<FavoriteCharacterResponse>;
}

/**
 * Eliminar un personaje de favoritos por su ID de la API
 */
export async function removeFavorite(apiCharacterId: number): Promise<void> {
  const response = await fetch('/api/favorites', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiCharacterId }),
  });

  if (response.status === 404) {
    throw new Error('Favorito no encontrado');
  }

  if (!response.ok) {
    throw new Error('Error al eliminar de favoritos');
  }
}
