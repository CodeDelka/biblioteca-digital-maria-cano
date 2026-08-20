import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TablaAdminSelectable from '@/components/admin/tablaadminselectable'

const POR_PAGINA = 12

export default async function AdminVideos({ searchParams }) {
  const params = await searchParams
  const paginaActual = Math.max(1, parseInt(params?.pagina) || 1)
  const desde = (paginaActual - 1) * POR_PAGINA
  const hasta = desde + POR_PAGINA - 1

  const supabase = await createClient()
  const { data: videos, count } = await supabase
    .from('videos')
    .select('*, categorias(nombre)', { count: 'exact' })
    .order('creado_en', { ascending: false })
    .range(desde, hasta)

  const totalPaginas = Math.max(1, Math.ceil((count || 0) / POR_PAGINA))

  const filas = (videos || []).map((video) => ({
    id: video.id,
    celdas: [
      <span className="font-medium text-institucional-gris">{video.titulo}</span>,
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${video.tipo_fuente === 'youtube' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
        {video.tipo_fuente === 'youtube' ? 'YouTube' : 'Archivo'}
      </span>,
      video.categorias?.nombre || '—',
      video.anio || '—',
    ],
    accionesExtra: (
      <Link href={`/admin/videos/${video.id}/editar`} className="text-institucional-azul hover:underline">
        Editar
      </Link>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">Gestión de Videos {count ? `(${count})` : ''}</h1>
        <Link href="/admin/videos/nuevo" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + Agregar video
        </Link>
      </div>

      <TablaAdminSelectable
        filas={filas}
        encabezados={['Título', 'Fuente', 'Categoría', 'Año']}
        tabla="videos"
        etiquetaSingular="video"
        etiquetaPlural="videos"
        mensajeVacio="No hay videos cargados aún."
      />

      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Link href={`/admin/videos?pagina=${Math.max(1, paginaActual - 1)}`} className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${paginaActual === 1 ? 'pointer-events-none border-gray-200 text-gray-300' : 'border-institucional-azul text-institucional-azul hover:bg-institucional-azul/5'}`}>
            ← Anterior
          </Link>
          <span className="text-sm text-institucional-gris">Página {paginaActual} de {totalPaginas}</span>
          <Link href={`/admin/videos?pagina=${Math.min(totalPaginas, paginaActual + 1)}`} className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${paginaActual === totalPaginas ? 'pointer-events-none border-gray-200 text-gray-300' : 'border-institucional-azul text-institucional-azul hover:bg-institucional-azul/5'}`}>
            Siguiente →
          </Link>
        </div>
      )}
    </div>
  )
}