export default function sitemap() {
  const urlBase = 'https://biblioteca-digital-maria-cano.vercel.app'

  const rutas = [
    { ruta: '', prioridad: 1.0, frecuencia: 'weekly' },
    { ruta: '/fotos', prioridad: 0.8, frecuencia: 'weekly' },
    { ruta: '/videos', prioridad: 0.8, frecuencia: 'weekly' },
    { ruta: '/documentos', prioridad: 0.7, frecuencia: 'monthly' },
    { ruta: '/historia', prioridad: 0.6, frecuencia: 'monthly' },
    { ruta: '/proyectos', prioridad: 0.7, frecuencia: 'weekly' },
    { ruta: '/contacto', prioridad: 0.5, frecuencia: 'yearly' },
    { ruta: '/buscar', prioridad: 0.4, frecuencia: 'monthly' },
  ]

  return rutas.map(({ ruta, prioridad, frecuencia }) => ({
    url: `${urlBase}${ruta}`,
    lastModified: new Date(),
    changeFrequency: frecuencia,
    priority: prioridad,
  }))
}