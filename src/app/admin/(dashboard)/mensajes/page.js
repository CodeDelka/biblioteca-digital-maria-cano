import { createClient } from '@/lib/supabase/server'
import TarjetasMensajesAdmin from '@/components/admin/tarjetasmensajesadmin'

export default async function AdminMensajes() {
  const supabase = await createClient()
  const { data: mensajes } = await supabase
    .from('mensajes_contacto')
    .select('*')
    .order('creado_en', { ascending: false })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-institucional-azul">Mensajes de Contacto</h1>
      <TarjetasMensajesAdmin mensajes={mensajes || []} />
    </div>
  )
}