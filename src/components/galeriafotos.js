'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function GaleriaFotos({ fotos }) {
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null)

  if (!fotos || fotos.length === 0) {
    return (
      <p className="py-12 text-center text-institucional-gris">
        Aún no hay fotografías en esta categoría.
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {fotos.map((foto) => (
          <button
            key={foto.id}
            onClick={() => setFotoSeleccionada(foto)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
          >
            <Image
              src={foto.url_imagen}
              alt={foto.titulo}
              fill
              className="object-cover transition group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
              <span className="text-left text-xs font-medium text-white">
                {foto.titulo}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox / visor ampliado */}
      {fotoSeleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setFotoSeleccionada(null)}
        >
          <button
            className="absolute right-4 top-4 text-4xl text-white hover:text-institucional-amarillo"
            onClick={() => setFotoSeleccionada(null)}
            aria-label="Cerrar"
          >
            &times;
          </button>

          <div
            className="relative max-h-[85vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full">
              <Image
                src={fotoSeleccionada.url_imagen}
                alt={fotoSeleccionada.titulo}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-3 text-center text-white">
              <h3 className="text-lg font-semibold">{fotoSeleccionada.titulo}</h3>
              {fotoSeleccionada.descripcion && (
                <p className="mt-1 text-sm text-white/80">
                  {fotoSeleccionada.descripcion}
                </p>
              )}
              {fotoSeleccionada.anio && (
                <p className="mt-1 text-xs text-white/60">{fotoSeleccionada.anio}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}