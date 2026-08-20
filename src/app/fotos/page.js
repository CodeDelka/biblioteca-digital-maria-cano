import { createClient } from '@/lib/supabase/server'
import GaleriaFotosConFiltro from '@/components/galeriafotosconfiltro'

export const metadata = {
  title: 'Fotos | Biblioteca Digital INEDHUMAC',
}

export default async function PaginaFotos() {
  const supabase = await createClient()

  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')

  const { data: fotos } = await supabase
    .from('fotos')
    .select('*')
    .order('creado_en', { ascending: false })

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-institucional-azul">
        Galería de Fotos
      </h1>
      <p className="mb-8 text-institucional-gris">
        Explora los momentos más importantes de nuestra institución.
      </p>

      <GaleriaFotosConFiltro categorias={categorias || []} fotos={fotos || []} />
    </main>
  )
}