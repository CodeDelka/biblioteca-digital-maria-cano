'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function TarjetaProyecto({ proyecto }) {
  const [expandido, setExpandido] = useState(false)
  const [fotoAmpliada, setFotoAmpliada] = useState(null)

  const fotos = proyecto.proyecto_fotos?.map((rel) => rel.fotos).filter(Boolean) || []
  const videos = proyecto.proyecto_videos?.map((rel) => rel.videos).filter(Boolean) || []
  const documentos = proyecto.proyecto_documentos?.map((rel) => rel.documentos).filter(Boolean) || []
  const integrantes = proyecto.integrantes_proyecto || []

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-institucional-azul">
            {proyecto.titulo}
          </h2>
          {proyecto.anio && (
            <span className="mt-1 inline-block rounded-full bg-institucional-amarillo px-3 py-1 text-xs font-bold text-institucional-azul">
              {proyecto.anio}
            </span>
          )}
        </div>
      </div>

      {proyecto.descripcion && (
        <p className="mt-3 text-institucional-gris">{proyecto.descripcion}</p>
      )}

      {integrantes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-institucional-azul">
            Integrantes
          </h3>
          <ul className="mt-1 flex flex-wrap gap-2">
            {integrantes.map((integrante) => (
              <li
                key={integrante.id}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-institucional-gris"
              >
                {integrante.nombre_completo}
                {integrante.rol_en_proyecto && (
                  <span className="text-institucional-azul"> · {integrante.rol_en_proyecto}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(fotos.length > 0 || videos.length > 0 || documentos.length > 0) && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="mt-4 text-sm font-semibold text-institucional-azul hover:underline"
        >
          {expandido ? 'Ocultar material del proyecto ▲' : 'Ver material del proyecto ▼'}
        </button>
      )}

      {expandido && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {fotos.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-institucional-azul">Fotos</h4>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {fotos.map((foto) => (
                  <button
                    key={foto.id}
                    onClick={() => setFotoAmpliada(foto)}
                    className="group relative aspect-square overflow-hidden rounded-md"
                  >
                    <Image
                      src={foto.url_imagen}
                      alt={foto.titulo}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-institucional-azul">Videos</h4>
              <ul className="list-inside list-disc text-sm text-institucional-gris">
                {videos.map((video) => (
                  <li key={video.id}>{video.titulo}</li>
                ))}
              </ul>
            </div>
          )}

          {documentos.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-institucional-azul">Documentos</h4>
              <ul className="space-y-1 text-sm">
                {documentos.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.url_archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-institucional-azul hover:underline"
                    >
                      {doc.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {fotoAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setFotoAmpliada(null)}
        >
          <button
            className="absolute right-4 top-4 text-4xl text-white hover:text-institucional-amarillo"
            onClick={() => setFotoAmpliada(null)}
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
                src={fotoAmpliada.url_imagen}
                alt={fotoAmpliada.titulo}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-3 text-center text-white">
              <h3 className="text-lg font-semibold">{fotoAmpliada.titulo}</h3>
              {fotoAmpliada.descripcion && (
                <p className="mt-1 text-sm text-white/80">{fotoAmpliada.descripcion}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}