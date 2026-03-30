'use client'
import { getCharacters } from "@/services/api"
import { Card } from "./components/Card"
import { useEffect, useState, useCallback } from "react"
import type { Character } from "@/types/rickMorty"
import { getFavorites, addFavorite, removeFavorite } from "@/services/favorites"
import LoadingState from "@/components/LoadingState"
import Link from "next/link"

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar personajes y favoritos al montar
  useEffect(() => {
    let isActive = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar personajes y favoritos en paralelo
        const [results, favs] = await Promise.all([
          getCharacters(),
          getFavorites(),
        ])

        if (!isActive) return
        setCharacters(results)
        setFavoriteIds(new Set(favs.map((f) => f.apiCharacterId)))
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error inesperado'
        if (!isActive) return
        setError(message)
      } finally {
        if (!isActive) return
        setLoading(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [])

  // Handler para toggle de favorito
  const handleToggleFavorite = useCallback(
    async (character: Character) => {
      const isCurrentlyFavorite = favoriteIds.has(character.id)

      try {
        if (isCurrentlyFavorite) {
          // Quitar de favoritos
          await removeFavorite(character.id)
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            next.delete(character.id)
            return next
          })
        } else {
          // Agregar a favoritos
          await addFavorite({
            apiCharacterId: character.id,
            characterName: character.name,
            characterImage: character.image,
          })
          setFavoriteIds((prev) => new Set(prev).add(character.id))
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al actualizar favorito'
        alert(message)
      }
    },
    [favoriteIds]
  )

  if (loading) return <LoadingState />
  if (error) return <p>Error: {error}</p>
  if (characters.length === 0) return <p>No hay personajes para mostrar.</p>

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Rick and Morty Characters</h1>
        <p style={styles.subtitle}>Explore the multiverse</p>
        <Link href="/favorites" style={styles.favLink}>
          ❤️ Mis Favoritos ({favoriteIds.size})
        </Link>
      </header>

      <section style={styles.grid}>
        {characters.map((char, index) => (
          <div
            key={char.id}
            style={{
              ...styles.cardWrapper,
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <Card
              title={char.name}
              description={`${char.species} · ${char.status}`}
              imageUrl={char.image}
              isFavorite={favoriteIds.has(char.id)}
              onToggleFavorite={() => handleToggleFavorite(char)}
            />
          </div>
        ))}
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#64748b',
    margin: '0 0 1rem 0',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  favLink: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  cardWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}
