'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CerrarSesionBoton() {
  const router = useRouter()

  const cerrarSesion = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={cerrarSesion}
      className="w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-white/20"
    >
      Cerrar sesión
    </button>
  )
}