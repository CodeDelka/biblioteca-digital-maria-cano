'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function FormularioHistoria({ eventoExistente }) {
  const router = useRouter()
  const esEdicion = Boolean(eventoExistente)

  const [tituloEvento, setTituloEvento] = useState(eventoExistente?.titulo_evento || '')
  const [descripcion, setDescripcion] = useState(eventoExistente?.descripcion || '')
  const [anio, setAnio] = useState(eventoExistente?.anio || '')
  const [orden, setOrden] = useState(eventoExistente?.orden || '')
  const [archivo, setArchivo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)

    const supabase = createClient()
    let fotoUrl = eventoExistente?.foto_url || null

    if (archivo) {
      const nombreArchivo = `${Date.now()}-${archivo.name}`
      const { error: errorSubida } = await supabase.storage
        .from('fotos')
        .upload(nombreArchivo, archivo)

      if (errorSubida) {
        setError('Error al subir la imagen: ' + errorSubida.message)
        setGuardando(false)
        return
      }

      const { data: urlPublica } = supabase.storage.from('fotos').getPublicUrl(nombreArchivo)
      fotoUrl = urlPublica.publicUrl
    }

    const datosEvento = {
      titulo_evento: tituloEvento,
      descripcion,
      anio: anio ? parseInt(anio) : null,
      orden: orden ? parseInt(orden) : null,
      foto_url: fotoUrl,
    }

    let errorGuardado
    if (esEdicion) {
      const { error } = await supabase
        .from('historia_colegio')
        .update(datosEvento)
        .eq('id', eventoExistente.id)
      errorGuardado = error
    } else {
      const { error } = await supabase.from('historia_colegio').insert(datosEvento)
      errorGuardado = error
    }

    if (errorGuardado) {
      setError('Error al guardar: ' + errorGuardado.message)
      setGuardando(false)
      return
    }

    router.push('/admin/historia')
    router.refresh()
  }

  return (
    <form onSubmit={manejarEnvio} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-semibold text-institucional-azul">Título del evento *</label>
        <input
          type="text"
          required
          value={tituloEvento}
          onChange={(e) => setTituloEvento(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-institucional-azul">Año *</label>
          <input
            type="number"
            required
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-institucional-azul">
            Orden en la línea de tiempo *
          </label>
          <input
            type="number"
            required
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">
          {esEdicion ? 'Reemplazar foto (opcional)' : 'Foto (opcional)'}
        </label>
        {esEdicion && eventoExistente?.foto_url && (
          <img
            src={eventoExistente.foto_url}
            alt="Actual"
            className="mt-2 h-24 w-24 rounded-md object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Agregar evento'}
      </button>
    </form>
  )
}