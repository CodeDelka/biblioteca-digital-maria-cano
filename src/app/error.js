'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ErrorGeneral({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Image src="/logo.png" alt="Logo INEDHUMAC" width={80} height={80} className="mb-6 opacity-80" />

      <h1 className="text-2xl font-bold text-institucional-azul">
        Algo salió mal
      </h1>
      <p className="mt-2 max-w-md text-institucional-gris">
        Ocurrió un error inesperado al cargar esta página. Puedes intentar de
        nuevo o volver al inicio.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="rounded-lg border border-institucional-azul px-6 py-3 font-semibold text-institucional-azul transition hover:bg-institucional-azul/5"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}