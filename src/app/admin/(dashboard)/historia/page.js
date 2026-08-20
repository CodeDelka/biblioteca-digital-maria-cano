import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TablaAdminSelectable from '@/components/admin/tablaadminselectable'

export default async function AdminHistoria() {
  const supabase = await createClient()
  const { data: eventos } = await supabase
    .from('historia_colegio')
    .select('*')
    .order('orden', { ascending: true })

  const filas = (eventos || []).map((evento) => ({
    id: evento.id,
    celdas: [
      evento.orden,
      <span className="font-medium text-institucional-gris">{evento.titulo_evento}</span>,
      evento.anio,
    ],
    accionesExtra: (
      <Link href={`/admin/historia/${evento.id}/editar`} className="text-institucional-azul hover:underline">
        Editar
      </Link>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">Gestión de Historia</h1>
        <Link href="/admin/historia/nuevo" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + Agregar evento
        </Link>
      </div>

      <TablaAdminSelectable
        filas={filas}
        encabezados={['Orden', 'Evento', 'Año']}
        tabla="historia_colegio"
        etiquetaSingular="evento"
        etiquetaPlural="eventos"
        mensajeVacio="No hay eventos cargados aún."
      />
    </div>
  )
}