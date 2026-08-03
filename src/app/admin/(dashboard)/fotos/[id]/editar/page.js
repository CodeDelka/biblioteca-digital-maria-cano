import { createClient } from '@/lib/supabase/server'
import FormularioFoto from '@/components/admin/formulariofoto'

export default async function EditarFoto({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: categorias } = await supabase.from('categorias').select('*').order('nombre')
  const { data: foto } = await supabase.from('fotos').select('*').eq('id', id).single()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">
        Editar foto
      </h1>
      <FormularioFoto categorias={categorias} fotoExistente={foto} />
    </div>
  )
}