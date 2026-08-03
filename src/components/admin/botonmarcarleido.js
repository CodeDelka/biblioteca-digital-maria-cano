'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BotonMarcarLeido({ mensajeId }) {
  const router = useRouter()

  const marcarLeido = async () => {
    const supabase = createClient()
    await supabase.from('mensajes_contacto').update({ leido: true }).eq('id', mensajeId)
    router.refresh()
  }

  return (
    <button onClick={marcarLeido} className="font-medium text-institucional-azul hover:underline">
      Marcar como leído
    </button>
  )
}