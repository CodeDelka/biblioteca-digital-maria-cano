import { createClient } from '@/lib/supabase/server'
import TarjetaProyecto from '@/components/tarjetaproyecto'

export const metadata = {
  title: 'Proyectos Educativos | Biblioteca Digital INEDHUMAC',
}

export default async function PaginaProyectos() {
  const supabase = await createClient()

  const { data: proyectos } = await supabase
    .from('proyectos_educativos')
    .select(`
      *,
      integrantes_proyecto (*),
      proyecto_fotos ( fotos (*) ),
      proyecto_videos ( videos (*) ),
      proyecto_documentos ( documentos (*) )
    `)
    .order('creado_en', { ascending: false })

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-institucional-azul">
        Proyectos Educativos
      </h1>
      <p className="mb-10 text-institucional-gris">
        Trabajos e investigaciones desarrollados por nuestros estudiantes.
      </p>

      <div className="space-y-6">
        {proyectos?.map((proyecto) => (
          <TarjetaProyecto key={proyecto.id} proyecto={proyecto} />
        ))}
      </div>

      {(!proyectos || proyectos.length === 0) && (
        <p className="text-center text-institucional-gris">
          Aún no hay proyectos cargados. Vuelve pronto.
        </p>
      )}
    </main>
  )
}