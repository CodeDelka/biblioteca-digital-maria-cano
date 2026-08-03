export default function LineaDeTiempo({ eventos }) {
  if (!eventos || eventos.length === 0) {
    return (
      <p className="py-12 text-center text-institucional-gris">
        Aún no hay eventos registrados en la historia del colegio.
      </p>
    )
  }

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Línea vertical */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-institucional-azul/20 sm:left-1/2 sm:-translate-x-1/2" />

      <div className="space-y-10">
        {eventos.map((evento, index) => (
          <div
            key={evento.id}
            className={`relative flex flex-col gap-4 sm:flex-row ${
              index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
            }`}
          >
            {/* Punto en la línea */}
            <div className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-institucional-amarillo ring-4 ring-institucional-azul sm:left-1/2" />

            {/* Contenido */}
            <div
              className={`ml-10 w-full sm:ml-0 sm:w-1/2 ${
                index % 2 === 0 ? 'sm:pr-10 sm:text-right' : 'sm:pl-10'
              }`}
            >
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                {evento.foto_url && (
                  <img
                    src={evento.foto_url}
                    alt={evento.titulo_evento}
                    className="mb-3 h-40 w-full rounded-md object-cover"
                  />
                )}
                <span className="inline-block rounded-full bg-institucional-amarillo px-3 py-1 text-sm font-bold text-institucional-azul">
                {evento.anio}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-institucional-azul">
                  {evento.titulo_evento}
                </h3>
                {evento.descripcion && (
                  <p className="mt-2 text-sm text-institucional-gris">
                    {evento.descripcion}
                  </p>
                )}
              </div>
            </div>

            {/* Espaciador para el lado opuesto en desktop */}
            <div className="hidden sm:block sm:w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}