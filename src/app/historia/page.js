import { createClient } from '@/lib/supabase/server'
import LineaDeTiempo from '@/components/lineadetiempo'

export const metadata = {
  title: 'Historia | Biblioteca Digital INEDHUMAC',
}

export default async function PaginaHistoria() {
  const supabase = await createClient()

  const { data: eventos } = await supabase
    .from('historia_colegio')
    .select('*')
    .order('orden', { ascending: true })

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-center text-3xl font-bold text-institucional-azul">
        Historia del Colegio
      </h1>
      <p className="mb-12 text-center text-institucional-gris">
        Un recorrido por los momentos que han marcado nuestra institución.
      </p>

      <LineaDeTiempo eventos={eventos} />
    </main>
  )
}