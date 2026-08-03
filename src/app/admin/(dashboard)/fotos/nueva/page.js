import { createClient } from '@/lib/supabase/server'
import FormularioFoto from '@/components/admin/formulariofoto'

export default async function NuevaFoto() {
  const supabase = await createClient()
  const { data: categorias } = await supabase.from('categorias').select('*').order('nombre')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">
        Subir nueva foto
      </h1>
      <FormularioFoto categorias={categorias} />
    </div>
  )
}