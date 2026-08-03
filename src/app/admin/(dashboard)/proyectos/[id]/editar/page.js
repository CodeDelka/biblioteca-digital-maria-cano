import { createClient } from '@/lib/supabase/server'
import FormularioProyecto from '@/components/admin/formularioproyecto'
import GestionIntegrantes from '@/components/admin/gestionintegrantes'

export default async function EditarProyecto({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: proyecto } = await supabase
    .from('proyectos_educativos')
    .select('*')
    .eq('id', id)
    .single()

  const { data: integrantes } = await supabase
    .from('integrantes_proyecto')
    .select('*')
    .eq('proyecto_id', id)
    .order('id')

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">Editar proyecto</h1>

      <FormularioProyecto proyectoExistente={proyecto} />

      <div className="mt-8 border-t pt-6">
        <GestionIntegrantes proyectoId={id} integrantesIniciales={integrantes} />
      </div>
    </div>
  )
}