import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BotonEliminarVideo from '@/components/admin/botoneliminarvideo'

export default async function AdminVideos() {
  const supabase = await createClient()

  const { data: videos } = await supabase
    .from('videos')
    .select('*, categorias(nombre)')
    .order('creado_en', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">
          Gestión de Videos
        </h1>
        <Link
          href="/admin/videos/nuevo"
          className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Agregar video
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Fuente</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Año</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {videos?.map((video) => (
              <tr key={video.id} className="border-t">
                <td className="p-3 font-medium text-institucional-gris">{video.titulo}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    video.tipo_fuente === 'youtube' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {video.tipo_fuente === 'youtube' ? 'YouTube' : 'Archivo'}
                  </span>
                </td>
                <td className="p-3 text-institucional-gris">{video.categorias?.nombre || '—'}</td>
                <td className="p-3 text-institucional-gris">{video.anio || '—'}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/videos/${video.id}/editar`}
                    className="mr-3 text-institucional-azul hover:underline"
                  >
                    Editar
                  </Link>
                  <BotonEliminarVideo videoId={video.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!videos || videos.length === 0) && (
          <p className="p-6 text-center text-institucional-gris">
            No hay videos cargados aún.
          </p>
        )}
      </div>
    </div>
  )
}