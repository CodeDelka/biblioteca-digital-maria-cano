import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TablaAdminSelectable from '@/components/admin/tablaadminselectable'

export default async function AdminProyectos() {
  const supabase = await createClient()
  const { data: proyectos } = await supabase
    .from('proyectos_educativos')
    .select('*, integrantes_proyecto(id)')
    .order('creado_en', { ascending: false })

  const filas = (proyectos || []).map((proyecto) => ({
    id: proyecto.id,
    celdas: [
      <span className="font-medium text-institucional-gris">{proyecto.titulo}</span>,
      proyecto.anio || '—',
      proyecto.integrantes_proyecto?.length || 0,
    ],
    accionesExtra: (
      <Link href={`/admin/proyectos/${proyecto.id}/editar`} className="text-institucional-azul hover:underline">
        Editar
      </Link>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">Gestión de Proyectos</h1>
        <Link href="/admin/proyectos/nuevo" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + Agregar proyecto
        </Link>
      </div>

      <TablaAdminSelectable
        filas={filas}
        encabezados={['Título', 'Año', 'Integrantes']}
        tabla="proyectos_educativos"
        etiquetaSingular="proyecto"
        etiquetaPlural="proyectos"
        mensajeVacio="No hay proyectos cargados aún."
      />
    </div>
  )
}