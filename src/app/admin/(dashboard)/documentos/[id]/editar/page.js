import { createClient } from '@/lib/supabase/server'
import FormularioDocumento from '@/components/admin/formulariodocumento'

export default async function EditarDocumento({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: documento } = await supabase.from('documentos').select('*').eq('id', id).single()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">Editar documento</h1>
      <FormularioDocumento documentoExistente={documento} />
    </div>
  )
}