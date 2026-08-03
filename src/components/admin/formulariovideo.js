'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function FormularioVideo({ categorias, videoExistente }) {
  const router = useRouter()
  const esEdicion = Boolean(videoExistente)

  const [titulo, setTitulo] = useState(videoExistente?.titulo || '')
  const [descripcion, setDescripcion] = useState(videoExistente?.descripcion || '')
  const [categoriaId, setCategoriaId] = useState(videoExistente?.categoria_id || '')
  const [anio, setAnio] = useState(videoExistente?.anio || '')
  const [tipoFuente, setTipoFuente] = useState(videoExistente?.tipo_fuente || 'youtube')
  const [idYoutube, setIdYoutube] = useState(
    videoExistente?.tipo_fuente === 'youtube' ? videoExistente?.url_video || '' : ''
  )
  const [archivo, setArchivo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')

    if (tipoFuente === 'youtube' && !idYoutube) {
      setError('Debes ingresar el ID o link del video de YouTube.')
      return
    }
    if (tipoFuente === 'archivo' && !esEdicion && !archivo) {
      setError('Debes seleccionar un archivo de video.')
      return
    }

    setGuardando(true)
    const supabase = createClient()
    let urlVideo = videoExistente?.url_video || null

    if (tipoFuente === 'youtube') {
      // Aceptamos que el usuario pegue el link completo o solo el ID, y extraemos el ID
      const match = idYoutube.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      urlVideo = match ? match[1] : idYoutube.trim()
    } else if (archivo) {
      const nombreArchivo = `${Date.now()}-${archivo.name}`
      const { error: errorSubida } = await supabase.storage
        .from('videos')
        .upload(nombreArchivo, archivo)

      if (errorSubida) {
        setError('Error al subir el video: ' + errorSubida.message)
        setGuardando(false)
        return
      }

      const { data: urlPublica } = supabase.storage.from('videos').getPublicUrl(nombreArchivo)
      urlVideo = urlPublica.publicUrl
    }

    const datosVideo = {
      titulo,
      descripcion,
      categoria_id: categoriaId || null,
      anio: anio ? parseInt(anio) : null,
      tipo_fuente: tipoFuente,
      url_video: urlVideo,
    }

    let errorGuardado
    if (esEdicion) {
      const { error } = await supabase.from('videos').update(datosVideo).eq('id', videoExistente.id)
      errorGuardado = error
    } else {
      const { data: usuario } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('videos')
        .insert({ ...datosVideo, subida_por: usuario.user?.id })
      errorGuardado = error
    }

    if (errorGuardado) {
      setError('Error al guardar: ' + errorGuardado.message)
      setGuardando(false)
      return
    }

    router.push('/admin/videos')
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
          <label className="block text-sm font-semibold text-institucional-azul">Categoría</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
          >
            <option value="">Sin categoría</option>
            {categorias?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
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
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">Fuente del video *</label>
        <div className="mt-1 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={tipoFuente === 'youtube'}
              onChange={() => setTipoFuente('youtube')}
            />
            YouTube
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={tipoFuente === 'archivo'}
              onChange={() => setTipoFuente('archivo')}
            />
            Subir archivo
          </label>
        </div>
      </div>

      {tipoFuente === 'youtube' ? (
        <div>
          <label className="block text-sm font-semibold text-institucional-azul">
            Link o ID de YouTube *
          </label>
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={idYoutube}
            onChange={(e) => setIdYoutube(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-institucional-azul">
            {esEdicion ? 'Reemplazar archivo (opcional)' : 'Archivo de video *'}
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setArchivo(e.target.files[0])}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Agregar video'}
      </button>
    </form>
  )
}