import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TablaAdminSelectable from '@/components/admin/tablaadminselectable'

export default async function AdminNoticias() {
  const supabase = await createClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('*')
    .order('publicado_en', { ascending: false })

  const filas = (noticias || []).map((noticia) => ({
    id: noticia.id,
    celdas: [
      <span className="font-medium text-institucional-gris">{noticia.titulo}</span>,
      new Date(noticia.publicado_en).toLocaleDateString('es-CO'),
    ],
    accionesExtra: (
      <Link href={`/admin/noticias/${noticia.id}/editar`} className="text-institucional-azul hover:underline">
        Editar
      </Link>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">Gestión de Noticias</h1>
        <Link href="/admin/noticias/nueva" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + Nueva noticia
        </Link>
      </div>

      <TablaAdminSelectable
        filas={filas}
        encabezados={['Título', 'Publicado']}
        tabla="noticias"
        etiquetaSingular="noticia"
        etiquetaPlural="noticias"
        mensajeVacio="No hay noticias publicadas aún."
      />
    </div>
  )
}