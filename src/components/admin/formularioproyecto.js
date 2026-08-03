'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function FormularioProyecto({ proyectoExistente }) {
  const router = useRouter()
  const esEdicion = Boolean(proyectoExistente)

  const [titulo, setTitulo] = useState(proyectoExistente?.titulo || '')
  const [descripcion, setDescripcion] = useState(proyectoExistente?.descripcion || '')
  const [anio, setAnio] = useState(proyectoExistente?.anio || '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)

    const supabase = createClient()
    const datosProyecto = {
      titulo,
      descripcion,
      anio: anio ? parseInt(anio) : null,
    }

    if (esEdicion) {
      const { error } = await supabase
        .from('proyectos_educativos')
        .update(datosProyecto)
        .eq('id', proyectoExistente.id)

      if (error) {
        setError('Error al guardar: ' + error.message)
        setGuardando(false)
        return
      }
      router.refresh()
      setGuardando(false)
    } else {
      const { data: usuario } = await supabase.auth.getUser()
      const { data: nuevoProyecto, error } = await supabase
        .from('proyectos_educativos')
        .insert({ ...datosProyecto, subida_por: usuario.user?.id })
        .select()
        .single()

      if (error) {
        setError('Error al guardar: ' + error.message)
        setGuardando(false)
        return
      }

      // Redirigimos a la página de edición para poder agregar integrantes
      router.push(`/admin/proyectos/${nuevoProyecto.id}/editar`)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-semibold text-institucional-azul">Título *</label>
        <input
          type="text"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">Año</label>
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear proyecto y continuar'}
      </button>
    </form>
  )
}