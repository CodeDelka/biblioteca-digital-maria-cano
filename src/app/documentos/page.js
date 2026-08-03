import { createClient } from '@/lib/supabase/server'
import VisorDocumentos from '@/components/visordocumentos'

export const metadata = {
  title: 'Documentos | Biblioteca Digital INEDHUMAC',
}

export default async function PaginaDocumentos() {
  const supabase = await createClient()

  const { data: documentos } = await supabase
    .from('documentos')
    .select('*')
    .order('creado_en', { ascending: false })

  // Agrupar por tipo_documento dinámicamente (no depende de la tabla categorias)
  const tipos = [...new Set(documentos?.map((d) => d.tipo_documento).filter(Boolean))]

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-institucional-azul">
        Documentos Institucionales
      </h1>
      <p className="mb-10 text-institucional-gris">
        Consulta manuales, reglamentos e informes de la institución.
      </p>

      {tipos.map((tipo) => {
        const documentosDeTipo = documentos.filter((d) => d.tipo_documento === tipo)

        return (
          <section key={tipo} className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-institucional-azul">
              {tipo}
            </h2>
            <VisorDocumentos documentos={documentosDeTipo} />
          </section>
        )
      })}

      {(!documentos || documentos.length === 0) && (
        <p className="text-center text-institucional-gris">
          Aún no hay documentos cargados. Vuelve pronto.
        </p>
      )}
    </main>
  )
}