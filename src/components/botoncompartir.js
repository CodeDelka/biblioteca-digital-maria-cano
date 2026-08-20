'use client'

import { useState } from 'react'

export default function BotonCompartir({ titulo, texto, url, claro = false }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const compartirNativo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url })
      } catch {
        // el usuario cerró el cuadro de compartir, no hacemos nada
      }
      return
    }
    setMenuAbierto((v) => !v)
  }

  const urlWhatsapp = `https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`
  const urlFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  const copiarEnlace = async () => {
    await navigator.clipboard.writeText(url)
    setMenuAbierto(false)
    alert('Enlace copiado al portapapeles')
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={compartirNativo}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          claro
            ? 'bg-white/15 text-white hover:bg-white/25'
            : 'border border-institucional-azul text-institucional-azul hover:bg-institucional-azul/5'
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 100 2.684m0-2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
        Compartir
      </button>

      {menuAbierto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
            <a
              href={urlWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md px-3 py-2 text-sm text-institucional-gris hover:bg-gray-100"
            >
              WhatsApp
            </a>
            <a
              href={urlFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md px-3 py-2 text-sm text-institucional-gris hover:bg-gray-100"
            >
              Facebook
            </a>
            <button
              onClick={copiarEnlace}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-institucional-gris hover:bg-gray-100"
            >
              Copiar enlace
            </button>
          </div>
        </>
      )}
    </div>
  )
}