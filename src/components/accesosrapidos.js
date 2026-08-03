import Link from 'next/link'

const accesos = [
  { nombre: 'Fotos', ruta: '/fotos', descripcion: 'Galería de eventos institucionales', icono: '📷' },
  { nombre: 'Videos', ruta: '/videos', descripcion: 'Actos, presentaciones y más', icono: '🎬' },
  { nombre: 'Documentos', ruta: '/documentos', descripcion: 'Manuales, reglamentos e informes', icono: '📄' },
  { nombre: 'Historia', ruta: '/historia', descripcion: 'Línea de tiempo del colegio', icono: '🏫' },
  { nombre: 'Proyectos', ruta: '/proyectos', descripcion: 'Trabajos de los estudiantes', icono: '🎓' },
]

export default function AccesosRapidos() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-institucional-azul sm:text-3xl">
        Explora la Biblioteca Digital
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {accesos.map((item) => (
          <Link
            key={item.ruta}
            href={item.ruta}
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="mb-2 text-4xl">{item.icono}</span>
            <span className="font-semibold text-institucional-azul group-hover:text-institucional-gris">
              {item.nombre}
            </span>
            <span className="mt-1 text-xs text-institucional-gris">
              {item.descripcion}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}