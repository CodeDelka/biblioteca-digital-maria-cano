export default function robots() {
  const urlBase = 'https://biblioteca-digital-maria-cano.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    sitemap: `${urlBase}/sitemap.xml`,
  }
}