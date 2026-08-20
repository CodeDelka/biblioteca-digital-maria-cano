import Link from 'next/link'
import Image from 'next/image'

export default function NoEncontrado() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Image
        src="/logo.png"
        alt="Logo INEDHUMAC"
        width={80}
        height={80}
        className="mb-6 opacity-80"
      />

      <span className="text-7xl font-bold text-institucional-azul">404</span>

      <h1 className="mt-4 text-2xl font-bold text-institucional-azul">
        Página no encontrada
      </h1>
      <p className="mt-2 max-w-md text-institucional-gris">
        Lo sentimos, la página que buscas no existe o fue movida. Puedes volver
        al inicio o explorar el contenido de la Biblioteca Digital.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110"
        >
          Volver al inicio
        </Link>
        <Link
          href="/buscar"
          className="rounded-lg border border-institucional-azul px-6 py-3 font-semibold text-institucional-azul transition hover:bg-institucional-azul/5"
        >
          Buscar contenido
        </Link>
      </div>
    </main>
  )
}