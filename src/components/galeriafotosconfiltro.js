'use client'

import { useState, useMemo } from 'react'
import GaleriaFotos from '@/components/galeriafotos'

export default function GaleriaFotosConFiltro({ categorias, fotos }) {
  const [categoriaActiva, setCategoriaActiva] = useState('todas')

  // Solo mostramos chips de categorías que realmente tienen al menos una foto
  const categoriasConContenido = useMemo(
    () => categorias.filter((cat) => fotos.some((f) => f.categoria_id === cat.id)),
    [categorias, fotos]
  )

  const fotosFiltradas = useMemo(() => {
    if (categoriaActiva === 'todas') return fotos
    return fotos.filter((f) => f.categoria_id === categoriaActiva)
  }, [fotos, categoriaActiva])

  return (
    <div>
      {/* Chips de filtro */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoriaActiva('todas')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            categoriaActiva === 'todas'
              ? 'bg-institucional-azul text-white'
              : 'bg-gray-100 text-institucional-gris hover:bg-gray-200'
          }`}
        >
          Todas ({fotos.length})
        </button>
        {categoriasConContenido.map((cat) => {
          const cantidad = fotos.filter((f) => f.categoria_id === cat.id).length
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

      {/* Galería filtrada (usa el mismo componente de siempre, con lightbox incluido) */}
      <GaleriaFotos fotos={fotosFiltradas} />
    </div>
  )
}