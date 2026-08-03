'use client'

import { useState } from 'react'

export default function GaleriaVideos({ videos }) {
  const [videoSeleccionado, setVideoSeleccionado] = useState(null)

  if (!videos || videos.length === 0) {
    return (
      <p className="py-12 text-center text-institucional-gris">
        Aún no hay videos en esta categoría.
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setVideoSeleccionado(video)}
            className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-lg"
          >
            <div className="relative flex aspect-video items-center justify-center bg-institucional-gris/10">
              {video.tipo_fuente === 'youtube' ? (
                <img
                  src={`https://img.youtube.com/vi/${video.url_video}/hqdefault.jpg`}
                  alt={video.titulo}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={video.url_video}
                  className="h-full w-full object-cover"
                  muted
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-institucional-amarillo shadow-lg transition group-hover:scale-110">
                  <svg className="ml-1 h-6 w-6 text-institucional-azul" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-institucional-azul">{video.titulo}</h3>
              {video.anio && (
                <p className="text-xs text-institucional-gris">{video.anio}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Modal del reproductor */}
      {videoSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setVideoSeleccionado(null)}
        >
          <button
            className="absolute right-4 top-4 text-4xl text-white hover:text-institucional-amarillo"
            onClick={() => setVideoSeleccionado(null)}
            aria-label="Cerrar"
          >
            &times;
          </button>

          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              {videoSeleccionado.tipo_fuente === 'youtube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoSeleccionado.url_video}?autoplay=1`}
                  title={videoSeleccionado.titulo}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoSeleccionado.url_video}
                  className="h-full w-full"
                  controls
                  autoPlay
                />
              )}
            </div>
            <div className="mt-3 text-center text-white">
              <h3 className="text-lg font-semibold">{videoSeleccionado.titulo}</h3>
              {videoSeleccionado.descripcion && (
                <p className="mt-1 text-sm text-white/80">
                  {videoSeleccionado.descripcion}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}