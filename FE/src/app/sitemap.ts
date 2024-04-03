import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(`${process.env.HOST_BE}/products`, {
    method: 'GET',
  })
  const result = await res.json()
  const productEntries: MetadataRoute.Sitemap = result.data.map((product: any) => ({
    url: `${process.env.HOST_FE}/shop/${product.slug}/${product._id}`,
    lastModified: new Date(product.updatedAt),
    priority: 0.5,
  }))
  return [
    {
      url: `${process.env.HOST_FE}/home`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${process.env.HOST_FE}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.HOST_FE}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.HOST_FE}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.HOST_FE}/quality`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...productEntries
  ]
}