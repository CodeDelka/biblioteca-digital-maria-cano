import { createClient } from '@/lib/supabase/server'
import BotonMarcarLeido from '@/components/admin/botonmarcarleido'
import BotonEliminarMensaje from '@/components/admin/botoneliminarmensaje'

export default async function AdminMensajes() {
  const supabase = await createClient()

  const { data: mensajes } = await supabase
    .from('mensajes_contacto')
    .select('*')
    .order('creado_en', { ascending: false })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">
        Mensajes de Contacto
      </h1>

      <div className="space-y-3">
        {mensajes?.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`rounded-xl border p-4 shadow-sm ${
              mensaje.leido ? 'border-gray-200 bg-white' : 'border-institucional-azul bg-institucional-azul/5'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-institucional-azul">
                  {mensaje.nombre}
                  {!mensaje.leido && (
                    <span className="ml-2 rounded-full bg-institucional-amarillo px-2 py-0.5 text-xs font-bold text-institucional-azul">
                      Nuevo
                    </span>
                  )}
                </p>
                <a
                  href={`mailto:${mensaje.email}`}
                  className="text-sm text-institucional-gris hover:underline"
                >
                  {mensaje.email}
                </a>
              </div>
              <span className="shrink-0 text-xs text-institucional-gris">
                {new Date(mensaje.creado_en).toLocaleDateString('es-CO')}
              </span>
            </div>

            <p className="mt-3 text-sm text-institucional-gris">{mensaje.mensaje}</p>

            <div className="mt-3 flex gap-4 text-sm">
              {!mensaje.leido && <BotonMarcarLeido mensajeId={mensaje.id} />}
              <BotonEliminarMensaje mensajeId={mensaje.id} />
            </div>
          </div>
        ))}

        {(!mensajes || mensajes.length === 0) && (
          <p className="p-6 text-center text-institucional-gris">
            No hay mensajes recibidos aún.
          </p>
        )}
      </div>
    </div>
  )
}