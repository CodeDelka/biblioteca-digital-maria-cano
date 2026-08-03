import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BotonEliminarHistoria from '@/components/admin/botoneliminarhistoria'

export default async function AdminHistoria() {
  const supabase = await createClient()

  const { data: eventos } = await supabase
    .from('historia_colegio')
    .select('*')
    .order('orden', { ascending: true })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">
          Gestión de Historia
        </h1>
        <Link
          href="/admin/historia/nuevo"
          className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Agregar evento
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="p-3">Orden</th>
              <th className="p-3">Evento</th>
              <th className="p-3">Año</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos?.map((evento) => (
              <tr key={evento.id} className="border-t">
                <td className="p-3 text-institucional-gris">{evento.orden}</td>
                <td className="p-3 font-medium text-institucional-gris">{evento.titulo_evento}</td>
                <td className="p-3 text-institucional-gris">{evento.anio}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/historia/${evento.id}/editar`}
                    className="mr-3 text-institucional-azul hover:underline"
                  >
                    Editar
                  </Link>
                  <BotonEliminarHistoria eventoId={evento.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!eventos || eventos.length === 0) && (
          <p className="p-6 text-center text-institucional-gris">
            No hay eventos cargados aún.
          </p>
        )}
      </div>
    </div>
  )
}