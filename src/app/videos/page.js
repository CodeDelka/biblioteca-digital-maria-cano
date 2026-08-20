import { createClient } from '@/lib/supabase/server'
import GaleriaVideosConFiltro from '@/components/galeriavideosconfiltro'

export const metadata = {
  title: 'Videos | Biblioteca Digital INEDHUMAC',
}

export default async function PaginaVideos() {
  const supabase = await createClient()

  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre')

  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .order('creado_en', { ascending: false })

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-institucional-azul">
        Galería de Videos
      </h1>
      <p className="mb-8 text-institucional-gris">
        Revive los momentos más destacados en video.
      </p>

      <GaleriaVideosConFiltro categorias={categorias || []} videos={videos || []} />
    </main>
  )
}