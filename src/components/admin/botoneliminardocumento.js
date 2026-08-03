'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BotonEliminarDocumento({ documentoId }) {
  const router = useRouter()
  const [eliminando, setEliminando] = useState(false)

  const manejarEliminar = async () => {
    const confirmado = window.confirm('¿Seguro que quieres eliminar este documento?')
    if (!confirmado) return

    setEliminando(true)
    const supabase = createClient()
    const { error } = await supabase.from('documentos').delete().eq('id', documentoId)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      setEliminando(false)
      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={manejarEliminar}
      disabled={eliminando}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {eliminando ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}