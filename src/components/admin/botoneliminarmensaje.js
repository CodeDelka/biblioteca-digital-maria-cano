'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BotonEliminarMensaje({ mensajeId }) {
  const router = useRouter()
  const [eliminando, setEliminando] = useState(false)

  const manejarEliminar = async () => {
    const confirmado = window.confirm('¿Eliminar este mensaje?')
    if (!confirmado) return

    setEliminando(true)
    const supabase = createClient()
    await supabase.from('mensajes_contacto').delete().eq('id', mensajeId)
    setEliminando(false)
    router.refresh()
  }

  return (
    <button
      onClick={manejarEliminar}
      disabled={eliminando}
      className="font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {eliminando ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}