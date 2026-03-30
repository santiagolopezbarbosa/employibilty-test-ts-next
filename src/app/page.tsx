'use client'
import { useState, useCallback, useEffect } from "react"
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useInView } from "react-intersection-observer"
import { getCharacters } from "@/services/api"
import { Card } from "./components/Card"
import { SkeletonCard } from "./components/SkeletonCard"
import type { Character } from "@/types/rickMorty"
import { getFavorites, addFavorite, removeFavorite } from "@/services/favorites"
import Link from "next/link"

export default function Home() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  // State
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { ref, inView } = useInView()

  // Redirigir si no está logeado
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login")
    }
  }, [sessionStatus, router])

  // Debounce simple para la busqueda
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  // Queries (TanStack Query)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: queryStatus,
  } = useInfiniteQuery({
    queryKey: ['characters', debouncedSearch, statusFilter],
    queryFn: ({ pageParam = 1 }) => getCharacters({ page: pageParam, name: debouncedSearch, status: statusFilter }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.info?.next) {
        const url = new URL(lastPage.info.next)
        return Number(url.searchParams.get('page'))
      }
      return undefined
    },
    enabled: sessionStatus === "authenticated", 
  })

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    enabled: sessionStatus === "authenticated",
  })
  const favoriteIds = new Set(favorites?.map(f => f.apiCharacterId) || [])

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const handleToggleFavorite = useCallback(
    async (character: Character) => {
      const isCurrentlyFavorite = favoriteIds.has(character.id)
      
      // Optimistic Update
      queryClient.setQueryData(['favorites'], (old: any) => {
        if (!old) return []
        if (isCurrentlyFavorite) return old.filter((f: any) => f.apiCharacterId !== character.id)
        return [...old, { apiCharacterId: character.id }]
      })

      try {
        if (isCurrentlyFavorite) {
          await removeFavorite(character.id)
        } else {
          await addFavorite({
            apiCharacterId: character.id,
            characterName: character.name,
            characterImage: character.image,
          })
        }
      } catch (err: unknown) {
        // Rollback
        queryClient.invalidateQueries({ queryKey: ['favorites'] })
      }
    },
    [favoriteIds, queryClient]
  )

  if (sessionStatus === "loading" || sessionStatus === "unauthenticated") {
    return <div className="loader-container min-h-screen"><div className="spinner"></div></div>
  }

  const allCharacters = data?.pages.flatMap(page => page.results) || []
  const initialDataInfo = data?.pages[0]?.info

  return (
    <main className="container">
      <div className="portal-swirl portal-green" />
      <div className="portal-swirl portal-cyan" />

      <header className="header">
        <div className="user-bar">
          <span className="user-greeting">Bienvenido, {session?.user?.name}</span>
          <button onClick={() => signOut()} className="logout-btn">Desconectar</button>
        </div>

        <h1 className="rm-title">
          Rick and Morty
          <span className="title-highlight"> Universe</span>
        </h1>
        <p className="subtitle">Maneja todo tu catálogo del multiverso</p>
        
        <Link href="/favorites" className="fav-link">
          <svg className="fav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#97ce4c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Directorio de Favoritos
          <span className="badge">{favoriteIds.size}</span>
        </Link>
      </header>

      <div className="dashboard-section">
        <section className="stats-grid">
          <div className="stat-card">
            <h6 className="stat-label">Personajes (Server)</h6>
            <p className="stat-value text-blue">{initialDataInfo?.count || 0}</p>
          </div>
          <div className="stat-card">
            <h6 className="stat-label">Páginas Totales</h6>
            <p className="stat-value text-portal">{initialDataInfo?.pages || 0}</p>
          </div>
        </section>

        <section className="filters">
          <div className="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-wrapper">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="select-input"
            >
              <option value="all">Filtro de Estado Vital</option>
              <option value="alive">Vivos (Alive)</option>
              <option value="dead">Muertos (Dead)</option>
              <option value="unknown">Desconocidos (Unknown)</option>
            </select>
          </div>
        </section>
      </div>

      <section className="grid">
        {queryStatus === 'pending' ? (
           Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : queryStatus === 'error' ? (
          <div className="error-card"><p>Error al sincronizar con la Ciudadela.</p></div>
        ) : allCharacters.length === 0 ? (
          <div className="no-results" style={{ gridColumn: '1 / -1' }}>
            <p>La base de datos de la Ciudadela no encontro resultados acordes a los filtros aplicados.</p>
          </div>
        ) : (
          allCharacters.map((char, index) => (
            char && <div
              key={`${char.id}-${index}`}
              className="card-wrapper"
            >
              <Card
                title={char.name}
                species={char.species}
                status={char.status}
                imageUrl={char.image}
                isFavorite={favoriteIds.has(char.id)}
                onToggleFavorite={() => handleToggleFavorite(char as Character)}
              />
            </div>
          ))
        )}

        {isFetchingNextPage && (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sc-${i}`} />)
        )}
      </section>

      {hasNextPage && !isFetchingNextPage && (
        <div ref={ref} className="load-more-trigger">
          Buscando más datos en el multiverso...
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Inter:wght@400;500;600;700;900&display=swap');
        body { margin: 0; background-color: #0b101a; color: #f8fafc; font-family: "Inter", sans-serif; -webkit-font-smoothing: antialiased; color-scheme: dark; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #0b101a; }
        ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: #97ce4c; }
        a { text-decoration: none; color: inherit; }
      `}</style>
      <style jsx>{`
        .user-bar { display: flex; justify-content: flex-end; align-items: center; gap: 15px; margin-bottom: 2rem; position: relative; z-index: 20; }
        .user-greeting { color: #94a3b8; font-size: 0.9rem; }
        .logout-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; padding: 6px 14px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.2); }
        .container { padding: 4rem 2rem; max-width: 1400px; margin: 0 auto; min-height: 100vh; position: relative; overflow-x: hidden; }
        .portal-swirl { position: fixed; border-radius: 50%; filter: blur(120px); z-index: -1; opacity: 0.35; animation: portalSpin 20s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate; }
        .portal-green { top: -20%; left: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, #97ce4c 0%, transparent 65%); }
        .portal-cyan { bottom: -20%; right: -10%; width: 70vw; height: 70vw; background: radial-gradient(circle, #00b5cc 0%, transparent 65%); animation-delay: -5s; }
        @keyframes portalSpin { 0% { transform: translate(0, 0) scale(1) rotate(0deg); } 50% { transform: translate(5%, 5%) scale(1.2) rotate(10deg); } 100% { transform: translate(-5%, 10%) scale(1.1) rotate(-5deg); } }
        .header { text-align: center; margin-bottom: 3.5rem; position: relative; z-index: 10; }
        .rm-title { font-family: 'Creepster', cursive; font-size: 5.5rem; font-weight: 400; margin: 0 0 0.5rem 0; letter-spacing: 0.05em; line-height: 1.1; color: #fff; filter: drop-shadow(0 0 10px #97ce4c60); }
        .title-highlight { display: block; background: linear-gradient(180deg, #97ce4c 0%, #00b5cc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { font-size: 1.25rem; color: #94a3b8; margin: 0 0 2.5rem 0; font-weight: 500;}
        .fav-link { display: inline-flex; align-items: center; gap: 10px; padding: 0.8rem 1.8rem; background: rgba(17, 24, 39, 0.6); border: 1px solid rgba(151, 206, 76, 0.3); color: #ffffff !important; border-radius: 9999px; font-weight: 400; font-family: 'Creepster', cursive; font-size: 1.4rem; letter-spacing: 0.05em; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter: blur(12px); position: relative; overflow: hidden; }
        .fav-link:hover { background: rgba(151, 206, 76, 0.2); border-color: #97ce4c; transform: translateY(-4px) scale(1.05); box-shadow: 0 0 20px rgba(151, 206, 76, 0.4); color: #97ce4c !important; }
        .fav-link::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(151, 206, 76, 0.1), transparent); transform: rotate(45deg); transition: 0.5s; pointer-events: none; }
        .fav-link:hover::after { left: 100%; }
        .fav-icon { width: 22px; height: 22px; animation: pulseSciFi 2.5s infinite ease-in-out; }
        @keyframes pulseSciFi { 0% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 2px rgba(151,206,76,0.5)); } 50% { transform: scale(1.15) rotate(15deg); filter: drop-shadow(0 0 12px rgba(151,206,76,1)); } 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 2px rgba(151,206,76,0.5)); } }
        .badge { background: rgba(151, 206, 76, 0.2); color: #97ce4c; border: 1px solid rgba(151, 206, 76, 0.5); padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: 800; margin-left: 4px; }
        .dashboard-section { max-width: 1000px; margin: 0 auto 3.5rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; position: relative; z-index: 10; }
        .stat-card { background: rgba(17, 24, 39, 0.5); padding: 1.5rem; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05); border-top: 1px solid rgba(151, 206, 76, 0.2); backdrop-filter: blur(12px); text-align: center; transition: transform 0.3s ease, border-color 0.3s; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6); }
        .stat-label { font-size: 0.9rem; color: #94a3b8; margin: 0 0 0.5rem 0; text-transform: uppercase; font-weight: 700; }
        .stat-value { font-size: 3rem; font-weight: 900; margin: 0; color: #f8fafc; }
        .text-portal { color: #97ce4c; text-shadow: 0 0 15px rgba(151, 206, 76, 0.4); }
        .text-blue { color: #00b5cc; text-shadow: 0 0 15px rgba(0, 181, 204, 0.3); }
        .filters { display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; position: relative; z-index: 10; background: rgba(17, 24, 39, 0.5); padding: 1.5rem; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); }
        .input-with-icon { flex: 1; min-width: 250px; position: relative; }
        .search-icon { position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #64748b; pointer-events: none; }
        .search-input { width: 100%; box-sizing: border-box; padding: 1.2rem 1.5rem 1.2rem 3rem; background: rgba(31, 41, 55, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; border-radius: 12px; font-size: 1.05rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .search-input:focus { outline: none; background: rgba(31, 41, 55, 0.9); border-color: #97ce4c; box-shadow: 0 0 0 4px rgba(151, 206, 76, 0.15); }
        .filter-wrapper { position: relative; }
        .select-input { padding: 1.2rem 1.5rem; background: rgba(31, 41, 55, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; border-radius: 12px; font-size: 1.05rem; cursor: pointer; transition: all 0.3s ease; appearance: none; -webkit-appearance: none; padding-right: 3rem; min-width: 220px; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.2em; color-scheme: dark; }
        .select-input:focus { outline: none; border-color: #97ce4c; box-shadow: 0 0 0 4px rgba(151, 206, 76, 0.15); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 2.5rem; place-items: center; }
        .load-more-trigger { text-align: center; color: #97ce4c; padding: 2rem; font-weight: 600; font-size: 1.2rem; }
        .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; color: #94a3b8; }
        .spinner { width: 50px; height: 50px; border: 4px solid rgba(255, 255, 255, 0.1); border-left-color: #97ce4c; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1.5rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* Animacion al montar card */
        .card-wrapper { animation: slideUp 0.6s ease forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  )
}
