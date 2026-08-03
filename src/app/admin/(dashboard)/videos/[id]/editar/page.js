import { createClient } from '@/lib/supabase/server'
import FormularioVideo from '@/components/admin/formulariovideo'

export default async function EditarVideo({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: categorias } = await supabase.from('categorias').select('*').order('nombre')
  const { data: video } = await supabase.from('videos').select('*').eq('id', id).single()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">Editar video</h1>
      <FormularioVideo categorias={categorias} videoExistente={video} />
    </div>
  )
}