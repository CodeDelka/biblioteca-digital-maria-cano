import { createClient } from '@/lib/supabase/server'
import FormularioHistoria from '@/components/admin/formulariohistoria'

export default async function EditarEventoHistoria({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: evento } = await supabase.from('historia_colegio').select('*').eq('id', id).single()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">Editar evento</h1>
      <FormularioHistoria eventoExistente={evento} />
    </div>
  )
}