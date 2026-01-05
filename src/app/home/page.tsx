'use client'
import { getCharacters } from "@/services/api"
import { Card } from "../components/Card"
import { useEffect, useState } from "react"
import type { Character } from "@/types/rickMorty"
import LoadingState from "@/components/LoadingState"

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const results = await getCharacters()
        if (!isActive) return
        setCharacters(results)
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

  if (loading) return <LoadingState />
  if (error) return <p>Error: {error}</p>
  if (characters.length === 0) return <p>No hay personajes para mostrar.</p>

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Home</h1>
        <p style={styles.subtitle}>Rick and Morty Characters</p>
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
    margin: 0,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
