'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function GestionIntegrantes({ proyectoId, integrantesIniciales }) {
  const router = useRouter()
  const [integrantes, setIntegrantes] = useState(integrantesIniciales || [])
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('')
  const [guardando, setGuardando] = useState(false)

  const agregarIntegrante = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return

    setGuardando(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('integrantes_proyecto')
      .insert({
        proyecto_id: proyectoId,
        nombre_completo: nombre,
        rol_en_proyecto: rol || null,
      })
      .select()
      .single()

    if (error) {
      alert('Error al agregar integrante: ' + error.message)
      setGuardando(false)
      return
    }

    setIntegrantes([...integrantes, data])
    setNombre('')
    setRol('')
    setGuardando(false)
    router.refresh()
  }

  const eliminarIntegrante = async (id) => {
    const supabase = createClient()
    const { error } = await supabase.from('integrantes_proyecto').delete().eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    setIntegrantes(integrantes.filter((i) => i.id !== id))
    router.refresh()
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-institucional-azul">
        Integrantes del proyecto
      </h3>

      {integrantes.length > 0 && (
        <ul className="mb-4 space-y-2">
          {integrantes.map((integrante) => (
            <li
              key={integrante.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2"
            >
              <span className="text-sm text-institucional-gris">
                {integrante.nombre_completo}
                {integrante.rol_en_proyecto && (
                  <span className="text-institucional-azul"> · {integrante.rol_en_proyecto}</span>
                )}
              </span>
              <button
                onClick={() => eliminarIntegrante(integrante.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={agregarIntegrante} className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-institucional-azul focus:outline-none"
        />
        <input
          type="text"
          placeholder="Rol (opcional)"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-institucional-azul focus:outline-none"
        />
        <button
          type="submit"
          disabled={guardando}
          className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
    </div>
  )
}