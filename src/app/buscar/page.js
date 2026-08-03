'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function PaginaBuscar() {
  const [termino, setTermino] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultados, setResultados] = useState({ fotos: [], videos: [], documentos: [] })
  const [buscoAlgunaVez, setBuscoAlgunaVez] = useState(false)

  const buscar = useCallback(async (texto) => {
    if (!texto.trim()) {
      setResultados({ fotos: [], videos: [], documentos: [] })
      return
    }

    setCargando(true)
    const supabase = createClient()
    const filtro = `titulo.ilike.%${texto}%,descripcion.ilike.%${texto}%`

    const [fotos, videos, documentos] = await Promise.all([
      supabase.from('fotos').select('*').or(filtro).limit(12),
      supabase.from('videos').select('*').or(filtro).limit(12),
      supabase.from('documentos').select('*').or(filtro).limit(12),
    ])

    setResultados({
      fotos: fotos.data || [],
      videos: videos.data || [],
      documentos: documentos.data || [],
    })
    setCargando(false)
    setBuscoAlgunaVez(true)
  }, [])

  // Debounce: espera 400ms después de que el usuario deja de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      buscar(termino)
    }, 400)
    return () => clearTimeout(timer)
  }, [termino, buscar])

  const totalResultados =
    resultados.fotos.length + resultados.videos.length + resultados.documentos.length

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-institucional-azul">
        Buscar en la Biblioteca
      </h1>
      <p className="mb-8 text-institucional-gris">
        Encuentra fotografías, videos y documentos por palabra clave.
      </p>

      <div className="relative">
        <input
          type="text"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          placeholder="Ej: feria, olimpiadas, manual de convivencia..."
          className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg focus:border-institucional-azul focus:outline-none"
          autoFocus
        />
        {cargando && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-institucional-gris">
            Buscando...
          </span>
        )}
      </div>

      {buscoAlgunaVez && !cargando && totalResultados === 0 && (
        <p className="mt-8 text-center text-institucional-gris">
          No se encontraron resultados para &quot;{termino}&quot;.
        </p>
      )}

      {resultados.fotos.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-institucional-azul">
            Fotos ({resultados.fotos.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {resultados.fotos.map((foto) => (
              <Link
                key={foto.id}
                href="/fotos"
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={foto.url_imagen}
                  alt={foto.titulo}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  <span className="text-xs font-medium text-white">{foto.titulo}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {resultados.videos.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-institucional-azul">
            Videos ({resultados.videos.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {resultados.videos.map((video) => (
              <Link
                key={video.id}
                href="/videos"
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-institucional-azul">{video.titulo}</h3>
                {video.anio && <p className="text-xs text-institucional-gris">{video.anio}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {resultados.documentos.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-institucional-azul">
            Documentos ({resultados.documentos.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {resultados.documentos.map((doc) => (
              <Link
                key={doc.id}
                href="/documentos"
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-institucional-azul">{doc.titulo}</h3>
                <p className="text-xs text-institucional-gris">{doc.tipo_documento}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}