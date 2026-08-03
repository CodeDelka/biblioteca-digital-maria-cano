import { createClient } from '@/lib/supabase/server'
import TarjetasNoticias from '@/components/tarjetasnoticias'

export default async function NoticiasRecientes() {
  const supabase = await createClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('*')
    .order('publicado_en', { ascending: false })
    .limit(5)

  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-institucional-azul sm:text-3xl">
            Noticias y Novedades
          </h2>
          <p className="mt-2 text-institucional-gris">
            Mantente al día con lo que sucede en nuestra institución.
          </p>
        </div>

        <TarjetasNoticias noticias={noticias} />
      </div>
    </section>
  )
}