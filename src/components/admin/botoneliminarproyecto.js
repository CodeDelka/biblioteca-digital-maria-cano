'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BotonEliminarProyecto({ proyectoId }) {
  const router = useRouter()
  const [eliminando, setEliminando] = useState(false)

  const manejarEliminar = async () => {
    const confirmado = window.confirm(
      '¿Seguro que quieres eliminar este proyecto? También se eliminarán sus integrantes.'
    )
    if (!confirmado) return

    setEliminando(true)
    const supabase = createClient()
    const { error } = await supabase.from('proyectos_educativos').delete().eq('id', proyectoId)

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