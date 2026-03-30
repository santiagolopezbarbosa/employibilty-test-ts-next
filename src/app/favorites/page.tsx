'use client'
import { useEffect, useState, useCallback } from 'react'
import { getFavorites, removeFavorite } from '@/services/favorites'
import type { FavoriteCharacterResponse } from '@/services/favorites'
import { Card } from '../components/Card'
import Link from 'next/link'
import LoadingState from '@/components/LoadingState'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteCharacterResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const load = async () => {
      try {
        setLoading(true)
        const data = await getFavorites()
        if (!isActive) return
        setFavorites(data)
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
    return () => { isActive = false }
  }, [])

  const handleRemove = useCallback(async (apiCharacterId: number) => {
    try {
      await removeFavorite(apiCharacterId)
      setFavorites((prev) => prev.filter((f) => f.apiCharacterId !== apiCharacterId))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar favorito'
      alert(message)
    }
  }, [])

  if (loading) return <LoadingState />
  if (error) return <p>Error: {error}</p>

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <Link href="/" style={styles.backLink}>
          ← Volver a personajes
        </Link>
        <h1 style={styles.title}>❤️ Mis Favoritos</h1>
        <p style={styles.subtitle}>
          {favorites.length === 0
            ? 'Aún no tienes personajes favoritos'
            : `${favorites.length} personaje${favorites.length !== 1 ? 's' : ''} guardado${favorites.length !== 1 ? 's' : ''}`}
        </p>
      </header>

      {favorites.length > 0 && (
        <section style={styles.grid}>
          {favorites.map((fav, index) => (
            <div
              key={fav.id}
              style={{
                ...styles.cardWrapper,
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <Card
                title={fav.characterName}
                description={`ID en API: ${fav.apiCharacterId}`}
                imageUrl={fav.characterImage}
                isFavorite={true}
                onToggleFavorite={() => handleRemove(fav.apiCharacterId)}
              />
            </div>
          ))}
        </section>
      )}

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
  backLink: {
    display: 'inline-block',
    marginBottom: '1rem',
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#64748b',
    margin: 0,
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
