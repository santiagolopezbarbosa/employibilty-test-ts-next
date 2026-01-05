import type { CharacterStatus } from '@/types/rickMorty'

export function isAlive(status: CharacterStatus): boolean {
  return status === 'Alive'
}
