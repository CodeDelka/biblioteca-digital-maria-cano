'use client'

import { useState, useMemo } from 'react'
import GaleriaVideos from '@/components/galeriavideos'

export default function GaleriaVideosConFiltro({ categorias, videos }) {
  const [categoriaActiva, setCategoriaActiva] = useState('todas')

  const categoriasConContenido = useMemo(
    () => categorias.filter((cat) => videos.some((v) => v.categoria_id === cat.id)),
    [categorias, videos]
  )

  const videosFiltrados = useMemo(() => {
    if (categoriaActiva === 'todas') return videos
    return videos.filter((v) => v.categoria_id === categoriaActiva)
  }, [videos, categoriaActiva])

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoriaActiva('todas')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            categoriaActiva === 'todas'
              ? 'bg-institucional-azul text-white'
              : 'bg-gray-100 text-institucional-gris hover:bg-gray-200'
          }`}
        >
          Todos ({videos.length})
        </button>
        {categoriasConContenido.map((cat) => {
          const cantidad = videos.filter((v) => v.categoria_id === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                categoriaActiva === cat.id
                  ? 'bg-institucional-azul text-white'
                  : 'bg-gray-100 text-institucional-gris hover:bg-gray-200'
              }`}
            >
              {cat.nombre} ({cantidad})
            </button>
          )
        })}
      </div>

      <GaleriaVideos videos={videosFiltrados} />
    </div>
  )
}