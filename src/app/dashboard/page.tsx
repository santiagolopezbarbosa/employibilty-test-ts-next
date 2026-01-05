'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCharacters } from '@/services/api';
import type { Character } from '@/types/rickMorty';
import LoadingState from '@/components/LoadingState';

interface CharacterStats {
  total: number;
  alive: number;
  dead: number;
  unknown: number;
}

export default function DashboardPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<CharacterStats>({
    total: 0,
    alive: 0,
    dead: 0,
    unknown: 0,
  });

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await getCharacters();

      setCharacters(results);
      setFilteredCharacters(results);
      calculateStats(results);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list: Character[]) => {
    const alive = list.filter(c => c.status === 'Alive').length;
    const dead = list.filter(c => c.status === 'Dead').length;
    const unknown = list.filter(c => c.status === 'unknown').length;

    setStats({
      total: list.length,
      alive,
      dead,
      unknown,
    });
  };

  useEffect(() => {
    let temp = [...characters];

    if (search) {
      temp = temp.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      temp = temp.filter(c => c.status === statusFilter);
    }

    setFilteredCharacters(temp);
  }, [search, statusFilter, characters]);

  
  const totalCharacters = useMemo(() => {
    return filteredCharacters.length;
  }, [filteredCharacters]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Rick and Morty Characters</p>
      </header>

      {/* Estadísticas */}
      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h6 style={styles.statLabel}>Total</h6>
          <p style={styles.statValue}>{stats.total}</p>
        </div>
        <div style={styles.statCard}>
          <h6 style={styles.statLabel}>Alive</h6>
          <p style={{ ...styles.statValue, ...styles.statAlive }}>{stats.alive}</p>
        </div>
        <div style={styles.statCard}>
          <h6 style={styles.statLabel}>Dead</h6>
          <p style={{ ...styles.statValue, ...styles.statDead }}>{stats.dead}</p>
        </div>
        <div style={styles.statCard}>
          <h6 style={styles.statLabel}>Unknown</h6>
          <p style={{ ...styles.statValue, ...styles.statUnknown }}>{stats.unknown}</p>
        </div>
      </section>

      {/* Filtros */}
      <section style={styles.filters}>
        <input
          type="text"
          placeholder="Buscar personaje..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={styles.selectInput}
        >
          <option value="all">Todos</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
        <span style={styles.totalVisible}>
          Total visibles: {totalCharacters}
        </span>
      </section>

      {/* Lista */}
      <section style={styles.grid}>
        {filteredCharacters.map((character, index) => (
          <article
            key={character.id}
            style={{
              ...styles.card,
              animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
            }}
          >
            <img
              src={character.image}
              alt={character.name}
              style={styles.image}
            />
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{character.name}</h3>
              <p style={styles.cardText}>
                <span
                  style={
                    character.status === 'Alive'
                      ? styles.badgeAlive
                      : character.status === 'Dead'
                      ? styles.badgeDead
                      : styles.badgeUnknown
                  }
                >
                  {character.status}
                </span>
              </p>
              <p style={styles.cardSpecies}>Especie: {character.species}</p>
            </div>
          </article>
        ))}
      </section>

      {filteredCharacters.length === 0 && (
        <div style={styles.noResults}>
          No se encontraron resultados.
        </div>
      )}
    </main>
  );
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    textAlign: 'center' as const,
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: '0 0 0.5rem 0',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    margin: 0,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  statAlive: { color: '#22c55e' },
  statDead: { color: '#ef4444' },
  statUnknown: { color: '#94a3b8' },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  selectInput: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  totalVisible: {
    color: '#64748b',
    fontSize: '0.875rem',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
  },
  cardContent: {
    padding: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  cardText: {
    margin: '0 0 0.5rem 0',
  },
  cardSpecies: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: 0,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  badgeAlive: {
    backgroundColor: '#22c55e',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  badgeDead: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  badgeUnknown: {
    backgroundColor: '#94a3b8',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  noResults: {
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: '1.125rem',
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};
