import { createClient } from '@/lib/supabase/server'
import FormularioNoticia from '@/components/admin/formularionoticia'

export default async function EditarNoticia({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: noticia } = await supabase.from('noticias').select('*').eq('id', id).single()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">Editar noticia</h1>
      <FormularioNoticia noticiaExistente={noticia} />
    </div>
  )
}