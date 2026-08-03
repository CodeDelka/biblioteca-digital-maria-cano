import { createClient } from '@/lib/supabase/server'
import GaleriaFotos from '@/components/galeriafotos'

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
      <p className="mb-10 text-institucional-gris">
        Explora los momentos más importantes de nuestra institución.
      </p>

      {categorias?.map((categoria) => {
        const fotosDeCategoria = fotos?.filter(
          (f) => f.categoria_id === categoria.id
        )

        if (!fotosDeCategoria || fotosDeCategoria.length === 0) return null

        return (
          <section key={categoria.id} className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-institucional-azul">
              {categoria.nombre}
            </h2>
            <GaleriaFotos fotos={fotosDeCategoria} />
          </section>
        )
      })}

      {(!fotos || fotos.length === 0) && (
        <p className="text-center text-institucional-gris">
          Aún no hay fotografías cargadas. Vuelve pronto.
        </p>
      )}
    </main>
  )
}