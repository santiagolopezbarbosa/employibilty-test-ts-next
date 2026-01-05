import type { Character } from '@/types/rickMorty'

interface CharacterCardProps {
  character: Pick<Character, 'name' | 'status'>
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div>
      <h2>{character.name}</h2>
      <p>{character.status}</p>
    </div>
  )
}
