import { createClient } from '@/lib/supabase/server'
import FormularioVideo from '@/components/admin/formulariovideo'

export default async function NuevoVideo() {
  const supabase = await createClient()
  const { data: categorias } = await supabase.from('categorias').select('*').order('nombre')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">Agregar nuevo video</h1>
      <FormularioVideo categorias={categorias} />
    </div>
  )
}