'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const enlaces = [
  { nombre: 'Inicio', ruta: '/' },
  { nombre: 'Fotos', ruta: '/fotos' },
  { nombre: 'Videos', ruta: '/videos' },
  { nombre: 'Documentos', ruta: '/documentos' },
  { nombre: 'Historia', ruta: '/historia' },
  { nombre: 'Proyectos', ruta: '/proyectos' },
  { nombre: 'Contacto', ruta: '/contacto' },
]

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-institucional-azul shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo + nombre */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo INEDHUMAC"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
        <span className="text-sm font-bold text-white sm:text-lg">
          <span className="sm:hidden">INEDHUMAC</span>
          <span className="hidden sm:inline">Biblioteca Digital INEDHUMAC</span>
        </span>
        </Link>

        {/* Menú de escritorio */}
        <div className="hidden items-center gap-6 md:flex">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.ruta}
              href={enlace.ruta}
              className="font-medium text-white transition hover:text-institucional-amarillo"
            >
              {enlace.nombre}
            </Link>
          ))}

          <Link
            href="/buscar"
            className="flex items-center text-white transition hover:text-institucional-amarillo"
            aria-label="Buscar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>
        </div>

        {/* Botón de menú móvil */}
        <button
          className="text-white md:hidden"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuAbierto ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil desplegado */}
      {menuAbierto && (
        <div className="flex flex-col gap-2 bg-institucional-azul px-4 pb-4 md:hidden">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.ruta}
              href={enlace.ruta}
              className="py-2 font-medium text-white transition hover:text-institucional-amarillo"
              onClick={() => setMenuAbierto(false)}
            >
              {enlace.nombre}
            </Link>
          ))}
          <Link
            href="/buscar"
            className="py-2 font-medium text-white transition hover:text-institucional-amarillo"
            onClick={() => setMenuAbierto(false)}
          >
            🔍 Buscar
          </Link>
        </div>
      )}
    </nav>
  )
}