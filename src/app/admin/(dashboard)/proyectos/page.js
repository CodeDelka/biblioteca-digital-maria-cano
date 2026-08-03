import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BotonEliminarProyecto from '@/components/admin/botoneliminarproyecto'

export default async function AdminProyectos() {
  const supabase = await createClient()

  const { data: proyectos } = await supabase
    .from('proyectos_educativos')
    .select('*, integrantes_proyecto(id)')
    .order('creado_en', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">
          Gestión de Proyectos
        </h1>
        <Link
          href="/admin/proyectos/nuevo"
          className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Agregar proyecto
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Año</th>
              <th className="p-3">Integrantes</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proyectos?.map((proyecto) => (
              <tr key={proyecto.id} className="border-t">
                <td className="p-3 font-medium text-institucional-gris">{proyecto.titulo}</td>
                <td className="p-3 text-institucional-gris">{proyecto.anio || '—'}</td>
                <td className="p-3 text-institucional-gris">
                  {proyecto.integrantes_proyecto?.length || 0}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/proyectos/${proyecto.id}/editar`}
                    className="mr-3 text-institucional-azul hover:underline"
                  >
                    Editar
                  </Link>
                  <BotonEliminarProyecto proyectoId={proyecto.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!proyectos || proyectos.length === 0) && (
          <p className="p-6 text-center text-institucional-gris">
            No hay proyectos cargados aún.
          </p>
        )}
      </div>
    </div>
  )
}