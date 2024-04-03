import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(`${process.env.HOST_BE}/products`, {
    method: 'GET',
  })
  const result = await res.json()
  const productEntries: MetadataRoute.Sitemap = result.data.map((product: any) => ({
    url: `https://organick-fullstack.vercel.app/shop/${product.slug}/${product._id}`,
    lastModified: new Date(product.updatedAt),
    priority: 0.5,
  }))
  return [
    {
      url: 'https://organick-fullstack.vercel.app/home',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://organick-fullstack.vercel.app/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://organick-fullstack.vercel.app/portfolio',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://organick-fullstack.vercel.app/services',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://organick-fullstack.vercel.app/quality',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...productEntries,
  ]
}
