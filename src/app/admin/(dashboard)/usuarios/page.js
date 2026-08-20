import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FormularioNuevoAdmin from '@/components/admin/formularionuevoadmin'
import TablaUsuariosAdmin from '@/components/admin/tablausuariosadmin'

export default async function AdminUsuarios() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: perfilActual } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfilActual?.rol !== 'super_admin') {
    redirect('/admin')
  }

  const { data: usuarios } = await supabase
    .from('profiles')
    .select('*')
    .order('creado_en', { ascending: false })

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-institucional-azul">Gestión de Usuarios</h1>
      <p className="mb-6 text-sm text-institucional-gris">
        Como Super Admin, puedes designar a otras personas como administradores.
      </p>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-institucional-azul">Agregar nuevo administrador</h2>
        <FormularioNuevoAdmin />
      </div>

      <TablaUsuariosAdmin usuarios={usuarios || []} />
    </div>
  )
}