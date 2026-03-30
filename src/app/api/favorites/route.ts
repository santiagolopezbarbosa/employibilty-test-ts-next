import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const userId = parseInt((session.user as any).id, 10);

    const favorites = await prisma.favoriteCharacter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(favorites, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener favoritos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const userId = parseInt((session.user as any).id, 10);

    const body = await request.json();
    const { apiCharacterId, characterName, characterImage } = body;

    if (!apiCharacterId || !characterName || !characterImage) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const favorite = await prisma.favoriteCharacter.create({
      data: {
        apiCharacterId,
        characterName,
        characterImage,
        userId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return NextResponse.json({ error: 'Este personaje ya está en tus favoritos' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const userId = parseInt((session.user as any).id, 10);

    const body = await request.json();
    const { apiCharacterId } = body;

    const deleted = await prisma.favoriteCharacter.deleteMany({
      where: { userId, apiCharacterId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Favorito no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Eliminado' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
