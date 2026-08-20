import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TablaAdminSelectable from '@/components/admin/tablaadminselectable'

const POR_PAGINA = 12

export default async function AdminDocumentos({ searchParams }) {
  const params = await searchParams
  const paginaActual = Math.max(1, parseInt(params?.pagina) || 1)
  const desde = (paginaActual - 1) * POR_PAGINA
  const hasta = desde + POR_PAGINA - 1

  const supabase = await createClient()
  const { data: documentos, count } = await supabase
    .from('documentos')
    .select('*', { count: 'exact' })
    .order('creado_en', { ascending: false })
    .range(desde, hasta)

  const totalPaginas = Math.max(1, Math.ceil((count || 0) / POR_PAGINA))

  const filas = (documentos || []).map((doc) => ({
    id: doc.id,
    celdas: [
      <span className="font-medium text-institucional-gris">{doc.titulo}</span>,
      doc.tipo_documento || '—',
      doc.anio || '—',
    ],
    accionesExtra: (
      <>
        <a href={doc.url_archivo} target="_blank" rel="noopener noreferrer" className="mr-3 text-institucional-azul hover:underline">
          Ver
        </a>
        <Link href={`/admin/documentos/${doc.id}/editar`} className="text-institucional-azul hover:underline">
          Editar
        </Link>
      </>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">Gestión de Documentos {count ? `(${count})` : ''}</h1>
        <Link href="/admin/documentos/nuevo" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
          + Subir documento
        </Link>
      </div>

      <TablaAdminSelectable
        filas={filas}
        encabezados={['Título', 'Tipo', 'Año']}
        tabla="documentos"
        etiquetaSingular="documento"
        etiquetaPlural="documentos"
        mensajeVacio="No hay documentos cargados aún."
      />

      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Link href={`/admin/documentos?pagina=${Math.max(1, paginaActual - 1)}`} className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${paginaActual === 1 ? 'pointer-events-none border-gray-200 text-gray-300' : 'border-institucional-azul text-institucional-azul hover:bg-institucional-azul/5'}`}>
            ← Anterior
          </Link>
          <span className="text-sm text-institucional-gris">Página {paginaActual} de {totalPaginas}</span>
          <Link href={`/admin/documentos?pagina=${Math.min(totalPaginas, paginaActual + 1)}`} className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${paginaActual === totalPaginas ? 'pointer-events-none border-gray-200 text-gray-300' : 'border-institucional-azul text-institucional-azul hover:bg-institucional-azul/5'}`}>
            Siguiente →
          </Link>
        </div>
      )}
    </div>
  )
}