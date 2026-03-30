'use client'
import { useEffect, useState, useCallback } from 'react'
import { getFavorites, removeFavorite } from '@/services/favorites'
import type { FavoriteCharacterResponse } from '@/services/favorites'
import { Card } from '../components/Card'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function FavoritesPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
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
        const message = err instanceof Error ? err.message : 'Error inesperado del servidor central.'
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

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login")
    }
  }, [sessionStatus, router])

  const handleRemove = useCallback(async (apiCharacterId: number) => {
    setFavorites((prev) => prev.filter((f) => f.apiCharacterId !== apiCharacterId))
    try {
      await removeFavorite(apiCharacterId)
    } catch (err: unknown) {
      const data = await getFavorites()
      setFavorites(data)
      alert('Error en el protocolo de borrado remoto. Re-sincronizando.')
    }
  }, [])

  return (
    <main className="container">
      <div className="portal-swirl portal-green" />

      <header className="header">
        <div className="nav-controls">
          <Link href="/" className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al Directorio Principal
          </Link>
        </div>

        <div className="header-content">
          <div className="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#97ce4c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="big-star">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h1 className="rm-title">Coleccion Privada</h1>
          <p className="subtitle">
            {loading ? 'Consultando sistema de archivos locales...' : favorites.length === 0
              ? 'No tienes registros guardados. Viaja al espacio exterior para encontrar personajes e invítalos con la insignia.'
              : `Has marcado un total de ${favorites.length} sujetos como prioritarios en la Ciudadela.`}
          </p>
        </div>
      </header>

      {(loading || sessionStatus === "loading") && (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error-card">
          <p>ERROR: {error}</p>
        </div>
      )}

      {(!loading && favorites.length > 0) && (
        <section className="grid">
          {favorites.map((fav, index) => (
            <div
              key={fav.id}
              className="card-wrapper"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Card
                title={fav.characterName}
                status="Guardado Local" 
                species={`Registro #${fav.id}`}
                imageUrl={fav.characterImage}
                isFavorite={true}
                onToggleFavorite={() => handleRemove(fav.apiCharacterId)}
              />
            </div>
          ))}
        </section>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Inter:wght@400;500;600;700;900&display=swap');

        body {
          margin: 0;
          background-color: #0b101a;
          color: #f8fafc;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color-scheme: dark;
        }

        a {
          text-decoration: none;
          color: inherit;
        }
      `}</style>

      <style jsx>{`
        .container {
          padding: 3rem 2rem;
          max-width: 1300px;
          margin: 0 auto;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .portal-swirl {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          z-index: -1;
          opacity: 0.3;
        }

        .portal-green {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 50vw;
          height: 30vw;
          background: radial-gradient(circle, #97ce4c60 0%, transparent 70%);
        }

        .header {
          margin-bottom: 4rem;
          position: relative;
          z-index: 10;
        }

        .nav-controls {
          margin-bottom: 2rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8 !important;
          text-decoration: none !important;
          font-weight: 400;
          font-family: 'Creepster', cursive;
          font-size: 1.3rem;
          letter-spacing: 0.05em;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          padding: 10px 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .back-link:hover {
          color: #97ce4c !important;
          background: rgba(151, 206, 76, 0.1);
          border-color: rgba(151, 206, 76, 0.3);
          transform: translateX(-4px) scale(1.05);
          box-shadow: 0 0 20px rgba(151, 206, 76, 0.2);
        }

        .back-link::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transform: rotate(45deg);
          transition: 0.6s;
          pointer-events: none;
        }

        .back-link:hover::after {
          left: 100%;
        }

        .header-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon-wrapper {
          background: rgba(151, 206, 76, 0.1);
          padding: 1rem;
          border-radius: 20px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(151, 206, 76, 0.3);
          box-shadow: 0 0 30px rgba(151, 206, 76, 0.2);
        }

        .big-star {
          width: 48px;
          height: 48px;
          animation: floatGlow 3s infinite ease-in-out;
        }

        @keyframes floatGlow {
          0% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 0 4px rgba(151,206,76,0.6)); }
          50% { transform: translateY(-8px) rotate(10deg); filter: drop-shadow(0 0 15px rgba(151,206,76,1)); }
          100% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 0 4px rgba(151,206,76,0.6)); }
        }

        .rm-title {
          font-family: 'Creepster', cursive;
          font-size: 5rem;
          font-weight: 400;
          margin: 0 0 1rem 0;
          color: #ffffff;
          letter-spacing: 0.05em;
          text-shadow: 0 0 20px rgba(151,206,76,0.6);
        }

        .subtitle {
          font-size: 1.25rem;
          color: #94a3b8;
          margin: 0;
          max-width: 600px;
          line-height: 1.6;
          font-family: "Inter", sans-serif;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 2.5rem;
          place-items: center;
        }

        .card-wrapper {
          opacity: 0;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left-color: #97ce4c; /* Verde portal */
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-card {
           background: rgba(239, 68, 68, 0.1);
           border: 1px solid rgba(239, 68, 68, 0.4);
           color: #fca5a5;
           padding: 1rem 2rem;
           border-radius: 12px;
           text-align: center;
           max-width: 500px;
           margin: 0 auto;
           font-family: monospace;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .rm-title { font-size: 3.5rem; }
          .container { padding: 2rem 1rem; }
        }
      `}</style>
    </main>
  )
}
