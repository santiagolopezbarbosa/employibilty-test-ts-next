/**
 * API Route Handlers — /api/favorites
 * 
 * Endpoints del backend para gestionar personajes favoritos:
 * - GET:    Obtener todos los favoritos del usuario
 * - POST:   Agregar un personaje a favoritos
 * - DELETE: Eliminar un personaje de favoritos
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ID del usuario por defecto (creado por el seed)
const DEFAULT_USER_ID = 1;

/**
 * GET /api/favorites
 * Retorna la lista de personajes favoritos del usuario
 */
export async function GET() {
  try {
    const favorites = await prisma.favoriteCharacter.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(favorites, { status: 200 });
  } catch (error: unknown) {
    console.error('Error al obtener favoritos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener favoritos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Agrega un personaje a la lista de favoritos
 * 
 * Body esperado:
 * {
 *   "apiCharacterId": number,
 *   "characterName": string,
 *   "characterImage": string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiCharacterId, characterName, characterImage } = body;

    // Validación de campos requeridos
    if (!apiCharacterId || !characterName || !characterImage) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: apiCharacterId, characterName, characterImage' },
        { status: 400 }
      );
    }

    // Validación de tipos
    if (typeof apiCharacterId !== 'number') {
      return NextResponse.json(
        { error: 'apiCharacterId debe ser un número' },
        { status: 400 }
      );
    }

    // Crear el favorito en la base de datos
    const favorite = await prisma.favoriteCharacter.create({
      data: {
        apiCharacterId,
        characterName,
        characterImage,
        userId: DEFAULT_USER_ID,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error: unknown) {
    // Manejar error de duplicado (índice único userId + apiCharacterId)
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint failed')
    ) {
      return NextResponse.json(
        { error: 'Este personaje ya está en tus favoritos' },
        { status: 409 }
      );
    }

    console.error('Error al agregar favorito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al agregar favorito' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites
 * Elimina un personaje de la lista de favoritos
 * 
 * Body esperado:
 * {
 *   "apiCharacterId": number
 * }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiCharacterId } = body;

    // Validación
    if (!apiCharacterId || typeof apiCharacterId !== 'number') {
      return NextResponse.json(
        { error: 'Se requiere apiCharacterId (número) para eliminar un favorito' },
        { status: 400 }
      );
    }

    // Buscar y eliminar el favorito usando el índice único compuesto
    const deleted = await prisma.favoriteCharacter.deleteMany({
      where: {
        userId: DEFAULT_USER_ID,
        apiCharacterId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Favorito no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Favorito eliminado correctamente' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error al eliminar favorito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al eliminar favorito' },
      { status: 500 }
    );
  }
}
