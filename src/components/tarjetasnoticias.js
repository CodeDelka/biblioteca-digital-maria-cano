'use client'

import { useState } from 'react'

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function TarjetasNoticias({ noticias }) {
  const [noticiaAbierta, setNoticiaAbierta] = useState(null)

  if (!noticias || noticias.length === 0) {
    return (
      <p className="text-center text-institucional-gris">
        Muy pronto encontrarás aquí las últimas noticias del colegio.
      </p>
    )
  }

  const [destacada, ...resto] = noticias

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Noticia destacada (la más reciente) */}
        <button
          onClick={() => setNoticiaAbierta(destacada)}
          className="group relative row-span-2 flex min-h-[320px] flex-col overflow-hidden rounded-2xl text-left shadow-md transition hover:shadow-xl md:min-h-full"
        >
          {destacada.imagen_url ? (
            <img
              src={destacada.imagen_url}
              alt={destacada.titulo}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-institucional-azul" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-institucional-azul/95 via-institucional-azul/40 to-transparent" />

          <div className="relative mt-auto p-6">
            <span className="inline-block rounded-full bg-institucional-amarillo px-3 py-1 text-xs font-bold text-institucional-azul">
              Última noticia
            </span>
            <h3 className="mt-3 text-2xl font-bold text-white">{destacada.titulo}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-white/85">{destacada.contenido}</p>
            <p className="mt-3 text-xs font-medium text-white/70">
              {formatearFecha(destacada.publicado_en)}
            </p>
          </div>
        </button>

        {/* Resto de noticias en tarjetas más pequeñas */}
        <div className="grid gap-4 sm:grid-cols-2">
          {resto.map((noticia) => (
            <button
              key={noticia.id}
              onClick={() => setNoticiaAbierta(noticia)}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-36 w-full overflow-hidden bg-institucional-azul/10">
                {noticia.imagen_url ? (
                  <img
                    src={noticia.imagen_url}
                    alt={noticia.titulo}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">📰</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h4 className="font-bold text-institucional-azul">{noticia.titulo}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-institucional-gris">
                  {noticia.contenido}
                </p>
                <p className="mt-2 text-xs text-institucional-gris/70">
                  {formatearFecha(noticia.publicado_en)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal de lectura completa */}
      {noticiaAbierta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setNoticiaAbierta(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {noticiaAbierta.imagen_url && (
              <img
                src={noticiaAbierta.imagen_url}
                alt={noticiaAbierta.titulo}
                className="h-56 w-full object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-institucional-azul">
                    {noticiaAbierta.titulo}
                  </h2>
                  <p className="mt-1 text-xs text-institucional-gris">
                    {formatearFecha(noticiaAbierta.publicado_en)}
                  </p>
                </div>
                <button
                  onClick={() => setNoticiaAbierta(null)}
                  className="text-2xl text-institucional-gris hover:text-institucional-azul"
                  aria-label="Cerrar"
                >
                  &times;
                </button>
              </div>
              <p className="mt-4 whitespace-pre-line text-institucional-gris">
                {noticiaAbierta.contenido}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}