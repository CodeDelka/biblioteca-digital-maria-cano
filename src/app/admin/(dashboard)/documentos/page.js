import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BotonEliminarDocumento from '@/components/admin/botoneliminardocumento'

export default async function AdminDocumentos() {
  const supabase = await createClient()

  const { data: documentos } = await supabase
    .from('documentos')
    .select('*')
    .order('creado_en', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">
          Gestión de Documentos
        </h1>
        <Link
          href="/admin/documentos/nuevo"
          className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Subir documento
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Año</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documentos?.map((doc) => (
              <tr key={doc.id} className="border-t">
                <td className="p-3 font-medium text-institucional-gris">{doc.titulo}</td>
                <td className="p-3 text-institucional-gris">{doc.tipo_documento || '—'}</td>
                <td className="p-3 text-institucional-gris">{doc.anio || '—'}</td>
                <td className="p-3 text-right">
                  <a
                    href={doc.url_archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-3 text-institucional-azul hover:underline"
                  >
                    Ver
                  </a>
                  <Link
                    href={`/admin/documentos/${doc.id}/editar`}
                    className="mr-3 text-institucional-azul hover:underline"
                  >
                    Editar
                  </Link>
                  <BotonEliminarDocumento documentoId={doc.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!documentos || documentos.length === 0) && (
          <p className="p-6 text-center text-institucional-gris">
            No hay documentos cargados aún.
          </p>
        )}
      </div>
    </div>
  )
}