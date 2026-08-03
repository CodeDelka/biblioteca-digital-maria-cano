'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BotonCambiarEstadoUsuario({ usuarioId, activo }) {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)

  const cambiarEstado = async () => {
    const accion = activo ? 'desactivar' : 'activar'
    const confirmado = window.confirm(`¿Seguro que quieres ${accion} a este usuario?`)
    if (!confirmado) return

    setGuardando(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ activo: !activo })
      .eq('id', usuarioId)

    if (error) {
      alert('Error: ' + error.message)
    }

    setGuardando(false)
    router.refresh()
  }

  return (
    <button
      onClick={cambiarEstado}
      disabled={guardando}
      className={`font-medium hover:underline disabled:opacity-50 ${
        activo ? 'text-red-600' : 'text-green-600'
      }`}
    >
      {activo ? 'Desactivar' : 'Activar'}
    </button>
  )
}