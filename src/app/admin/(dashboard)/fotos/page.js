import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import BotonEliminarFoto from '@/components/admin/botoneliminarfoto'

export default async function AdminFotos() {
  const supabase = await createClient()

  const { data: fotos } = await supabase
    .from('fotos')
    .select('*, categorias(nombre)')
    .order('creado_en', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-institucional-azul">
          Gestión de Fotos
        </h1>
        <Link
          href="/admin/fotos/nueva"
          className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          + Subir foto
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="p-3">Imagen</th>
              <th className="p-3">Título</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Año</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fotos?.map((foto) => (
              <tr key={foto.id} className="border-t">
                <td className="p-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <Image src={foto.url_imagen} alt={foto.titulo} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-3 font-medium text-institucional-gris">{foto.titulo}</td>
                <td className="p-3 text-institucional-gris">{foto.categorias?.nombre || '—'}</td>
                <td className="p-3 text-institucional-gris">{foto.anio || '—'}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/fotos/${foto.id}/editar`}
                    className="mr-3 text-institucional-azul hover:underline"
                  >
                    Editar
                  </Link>
                  <BotonEliminarFoto fotoId={foto.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!fotos || fotos.length === 0) && (
          <p className="p-6 text-center text-institucional-gris">
            No hay fotos cargadas aún.
          </p>
        )}
      </div>
    </div>
  )
}