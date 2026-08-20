'use client'

import { useState } from 'react'
import BotonCompartir from '@/components/botoncompartir'

export default function VisorDocumentos({ documentos }) {
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null)

  if (!documentos || documentos.length === 0) {
    return (
      <p className="py-12 text-center text-institucional-gris">
        Aún no hay documentos en esta categoría.
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {documentos.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setDocumentoSeleccionado(doc)}
            className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-institucional-azul/10">
              <svg className="h-6 w-6 text-institucional-azul" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-institucional-azul">
                {doc.titulo}
              </h3>
              <p className="text-xs text-institucional-gris">
                {doc.tipo_documento} {doc.anio ? `- ${doc.anio}` : ''}
              </p>
            </div>
          </button>
        ))}
      </div>

      {documentoSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setDocumentoSeleccionado(null)}
        >
          <div
            className="flex h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-3">
              <h3 className="font-semibold text-institucional-azul">
                {documentoSeleccionado.titulo}
              </h3>
              <div className="flex items-center gap-3">
                <BotonCompartir
                  titulo={documentoSeleccionado.titulo}
                  texto={`${documentoSeleccionado.titulo} - Biblioteca Digital INEDHUMAC`}
                  url={documentoSeleccionado.url_archivo}
                />
                  <a
                  href={documentoSeleccionado.url_archivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-institucional-azul hover:underline"
                >
                  Abrir en pestana nueva
                </a>
                <button
                  onClick={() => setDocumentoSeleccionado(null)}
                  className="text-2xl text-institucional-gris hover:text-institucional-azul"
                  aria-label="Cerrar"
                >
                  &times;
                </button>
              </div>
            </div>
            <iframe
              src={documentoSeleccionado.url_archivo}
              title={documentoSeleccionado.titulo}
              className="flex-1 rounded-b-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}