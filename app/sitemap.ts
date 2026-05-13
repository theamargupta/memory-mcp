import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mcp.devfrend.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = ['/', '/about', '/by-amar', '/login']
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
