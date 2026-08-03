import { createClient } from '@/lib/supabase/server'
import GaleriaVideos from '@/components/galeriavideos'

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
      <p className="mb-10 text-institucional-gris">
        Revive los momentos más destacados en video.
      </p>

      {categorias?.map((categoria) => {
        const videosDeCategoria = videos?.filter(
          (v) => v.categoria_id === categoria.id
        )

        if (!videosDeCategoria || videosDeCategoria.length === 0) return null

        return (
          <section key={categoria.id} className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-institucional-azul">
              {categoria.nombre}
            </h2>
            <GaleriaVideos videos={videosDeCategoria} />
          </section>
        )
      })}

      {(!videos || videos.length === 0) && (
        <p className="text-center text-institucional-gris">
          Aún no hay videos cargados. Vuelve pronto.
        </p>
      )}
    </main>
  )
}