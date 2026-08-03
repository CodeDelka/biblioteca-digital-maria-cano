'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function FormularioNoticia({ noticiaExistente }) {
  const router = useRouter()
  const esEdicion = Boolean(noticiaExistente)

  const [titulo, setTitulo] = useState(noticiaExistente?.titulo || '')
  const [contenido, setContenido] = useState(noticiaExistente?.contenido || '')
  const [archivo, setArchivo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)

    const supabase = createClient()
    let imagenUrl = noticiaExistente?.imagen_url || null

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
      imagenUrl = urlPublica.publicUrl
    }

    const datosNoticia = {
      titulo,
      contenido,
      imagen_url: imagenUrl,
    }

    let errorGuardado
    if (esEdicion) {
      const { error } = await supabase
        .from('noticias')
        .update(datosNoticia)
        .eq('id', noticiaExistente.id)
      errorGuardado = error
    } else {
      const { error } = await supabase.from('noticias').insert(datosNoticia)
      errorGuardado = error
    }

    if (errorGuardado) {
      setError('Error al guardar: ' + errorGuardado.message)
      setGuardando(false)
      return
    }

    router.push('/admin/noticias')
    router.refresh()
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
        <label className="block text-sm font-semibold text-institucional-azul">Contenido *</label>
        <textarea
          required
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">
          {esEdicion ? 'Reemplazar imagen (opcional)' : 'Imagen (opcional)'}
        </label>
        {esEdicion && noticiaExistente?.imagen_url && (
          <img
            src={noticiaExistente.imagen_url}
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
        {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Publicar noticia'}
      </button>
    </form>
  )
}