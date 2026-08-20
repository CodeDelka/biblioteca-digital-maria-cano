import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function contar(supabase, tabla, filtro) {
  let query = supabase.from(tabla).select('*', { count: 'exact', head: true })
  if (filtro) query = query.match(filtro)
  const { count } = await query
  return count || 0
}

export default async function DashboardAdmin() {
  const supabase = await createClient()

  const [
    totalFotos,
    totalVideos,
    totalDocumentos,
    totalProyectos,
    totalHistoria,
    totalNoticias,
    mensajesSinLeer,
    totalMensajes,
  ] = await Promise.all([
    contar(supabase, 'fotos'),
    contar(supabase, 'videos'),
    contar(supabase, 'documentos'),
    contar(supabase, 'proyectos_educativos'),
    contar(supabase, 'historia_colegio'),
    contar(supabase, 'noticias'),
    contar(supabase, 'mensajes_contacto', { leido: false }),
    contar(supabase, 'mensajes_contacto'),
  ])

  const { data: { user } } = await supabase.auth.getUser()
  const { data: perfil } = await supabase
    .from('profiles')
    .select('nombre_completo')
    .eq('id', user.id)
    .single()

  const tarjetas = [
    { nombre: 'Fotos', cantidad: totalFotos, icono: '📷', ruta: '/admin/fotos' },
    { nombre: 'Videos', cantidad: totalVideos, icono: '🎬', ruta: '/admin/videos' },
    { nombre: 'Documentos', cantidad: totalDocumentos, icono: '📄', ruta: '/admin/documentos' },
    { nombre: 'Proyectos', cantidad: totalProyectos, icono: '🎓', ruta: '/admin/proyectos' },
    { nombre: 'Eventos de historia', cantidad: totalHistoria, icono: '🏫', ruta: '/admin/historia' },
    { nombre: 'Noticias', cantidad: totalNoticias, icono: '📰', ruta: '/admin/noticias' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-institucional-azul">
        Bienvenido, {perfil?.nombre_completo?.split(' ')[0] || 'Administrador'}
      </h1>
      <p className="mt-1 text-institucional-gris">
        Resumen general del contenido de la Biblioteca Digital.
      </p>

      {/* Alerta de mensajes sin leer */}
      {mensajesSinLeer > 0 && (
        <Link
          href="/admin/mensajes"
          className="mt-6 flex items-center justify-between rounded-xl border border-institucional-amarillo bg-institucional-amarillo/20 px-5 py-4 transition hover:bg-institucional-amarillo/30"
        >
          <span className="font-semibold text-institucional-azul">
            📬 Tienes {mensajesSinLeer} {mensajesSinLeer === 1 ? 'mensaje nuevo' : 'mensajes nuevos'} sin leer
          </span>
          <span className="text-sm font-medium text-institucional-azul underline">Ver mensajes →</span>
        </Link>
      )}

      {/* Tarjetas de conteo */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {tarjetas.map((tarjeta) => (
          <Link
            key={tarjeta.ruta}
            href={tarjeta.ruta}
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <span className="text-3xl">{tarjeta.icono}</span>
            <span className="mt-2 text-2xl font-bold text-institucional-azul">
              {tarjeta.cantidad}
            </span>
            <span className="text-xs font-medium text-institucional-gris group-hover:text-institucional-azul">
              {tarjeta.nombre}
            </span>
          </Link>
        ))}
      </div>

      {/* Resumen de mensajes */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold text-institucional-azul">Mensajes de contacto</h2>
        <div className="mt-3 flex gap-8">
          <div>
            <p className="text-2xl font-bold text-institucional-azul">{totalMensajes}</p>
            <p className="text-xs text-institucional-gris">Total recibidos</p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${mensajesSinLeer > 0 ? 'text-institucional-amarillo' : 'text-green-600'}`}>
              {mensajesSinLeer}
            </p>
            <p className="text-xs text-institucional-gris">Sin leer</p>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-8">
        <h2 className="mb-3 font-semibold text-institucional-azul">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/fotos/nueva" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            + Subir fotos
          </Link>
          <Link href="/admin/videos/nuevo" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            + Agregar video
          </Link>
          <Link href="/admin/noticias/nueva" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            + Publicar noticia
          </Link>
          <Link href="/admin/proyectos/nuevo" className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            + Nuevo proyecto
          </Link>
        </div>
      </div>
    </div>
  )
}