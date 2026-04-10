export const MEMORIES_CACHE_TAG_PREFIX = 'memories'

export function getUserMemoriesCacheTag(userId: string) {
  return `${MEMORIES_CACHE_TAG_PREFIX}:${userId}`
}
