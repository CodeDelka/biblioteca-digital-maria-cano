import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BotonEliminarNoticia from '@/components/admin/botoneliminarnoticia'

export default async function AdminNoticias() {
  const supabase = await createClient()

  const { data: noticias } = await supabase
    .from('noticias')
    .select('*')
    .order('publicado_en', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">
          Gestión de Noticias
        </h1>
        <Link
          href="/admin/noticias/nueva"
          className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Nueva noticia
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Publicado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias?.map((noticia) => (
              <tr key={noticia.id} className="border-t">
                <td className="p-3 font-medium text-institucional-gris">{noticia.titulo}</td>
                <td className="p-3 text-institucional-gris">
                  {new Date(noticia.publicado_en).toLocaleDateString('es-CO')}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/noticias/${noticia.id}/editar`}
                    className="mr-3 text-institucional-azul hover:underline"
                  >
                    Editar
                  </Link>
                  <BotonEliminarNoticia noticiaId={noticia.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!noticias || noticias.length === 0) && (
          <p className="p-6 text-center text-institucional-gris">
            No hay noticias publicadas aún.
          </p>
        )}
      </div>
    </div>
  )
}