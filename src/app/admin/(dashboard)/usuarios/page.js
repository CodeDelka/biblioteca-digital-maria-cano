import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FormularioNuevoAdmin from '@/components/admin/formularionuevoadmin'
import BotonCambiarEstadoUsuario from '@/components/admin/botoncambiarestadousuario'

export default async function AdminUsuarios() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: perfilActual } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  // Protección extra: solo super_admin puede ver esta página
  if (perfilActual?.rol !== 'super_admin') {
    redirect('/admin')
  }

  const { data: usuarios } = await supabase
    .from('profiles')
    .select('*')
    .order('creado_en', { ascending: false })

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-institucional-azul">
        Gestión de Usuarios
      </h1>
      <p className="mb-6 text-sm text-institucional-gris">
        Como Super Admin, puedes designar a otras personas como administradores.
      </p>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-institucional-azul">Agregar nuevo administrador</h2>
        <FormularioNuevoAdmin />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios?.map((usuario) => (
              <tr key={usuario.id} className="border-t">
                <td className="p-3 font-medium text-institucional-gris">
                  {usuario.nombre_completo}
                </td>
                <td className="p-3 text-institucional-gris">{usuario.email}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    usuario.rol === 'super_admin'
                      ? 'bg-institucional-amarillo text-institucional-azul'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {usuario.rol === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={usuario.activo ? 'text-green-600' : 'text-red-600'}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {usuario.rol !== 'super_admin' && (
                    <BotonCambiarEstadoUsuario
                      usuarioId={usuario.id}
                      activo={usuario.activo}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}