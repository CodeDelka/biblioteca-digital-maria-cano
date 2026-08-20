import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CerrarSesionBoton from '@/components/cerrarsesionboton'

const enlacesAdmin = [
  { nombre: 'Dashboard', ruta: '/admin' },
  { nombre: 'Fotos', ruta: '/admin/fotos' },
  { nombre: 'Videos', ruta: '/admin/videos' },
  { nombre: 'Documentos', ruta: '/admin/documentos' },
  { nombre: 'Historia', ruta: '/admin/historia' },
  { nombre: 'Proyectos', ruta: '/admin/proyectos' },
  { nombre: 'Noticias', ruta: '/admin/noticias' },
  { nombre: 'Mensajes', ruta: '/admin/mensajes' },
  { nombre: 'Usuarios', ruta: '/admin/usuarios' },
]

export default async function LayoutAdmin({ children }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Esto no debería pasar gracias al middleware, pero es una segunda capa de seguridad
  if (!user) {
    redirect('/admin/login')
  }

  const { data: perfil } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

    const { count: mensajesSinLeer } = await supabase
  .from('mensajes_contacto')
  .select('*', { count: 'exact', head: true })
  .eq('leido', false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Menú lateral */}
      <aside className="w-64 shrink-0 bg-institucional-azul text-white">
        <div className="border-b border-white/20 p-4">
          <h2 className="font-bold">Panel Administrativo</h2>
          <p className="text-xs text-white/70">{perfil?.nombre_completo}</p>
          <span className="mt-1 inline-block rounded-full bg-institucional-amarillo px-2 py-0.5 text-xs font-bold text-institucional-azul">
            {perfil?.rol === 'super_admin' ? 'Super Admin' : 'Admin'}
          </span>
        </div>

        <nav className="flex flex-col p-2">
          {enlacesAdmin.map((enlace) => {
            if (enlace.ruta === '/admin/usuarios' && perfil?.rol !== 'super_admin') {
              return null
            }
            return (
              <Link
                key={enlace.ruta}
                href={enlace.ruta}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10"
              >
                {enlace.nombre}
                {enlace.ruta === '/admin/mensajes' && mensajesSinLeer > 0 && (
                  <span className="rounded-full bg-institucional-amarillo px-2 py-0.5 text-xs font-bold text-institucional-azul">
                    {mensajesSinLeer}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-2">
          <CerrarSesionBoton />
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}