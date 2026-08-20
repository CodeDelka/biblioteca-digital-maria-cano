'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function nombreSinExtension(nombreArchivo) {
  return nombreArchivo.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
}

export default function FormularioVideo({ categorias, videoExistente }) {
  const router = useRouter()
  const esEdicion = Boolean(videoExistente)

  const [descripcion, setDescripcion] = useState(videoExistente?.descripcion || '')
  const [categoriaId, setCategoriaId] = useState(videoExistente?.categoria_id || '')
  const [anio, setAnio] = useState(videoExistente?.anio || '')
  const [tipoFuente, setTipoFuente] = useState(videoExistente?.tipo_fuente || 'youtube')

  // Edición (un solo video)
  const [tituloEdicion, setTituloEdicion] = useState(videoExistente?.titulo || '')
  const [idYoutubeEdicion, setIdYoutubeEdicion] = useState(
    videoExistente?.tipo_fuente === 'youtube' ? videoExistente?.url_video || '' : ''
  )
  const [archivoEdicion, setArchivoEdicion] = useState(null)

  // Creación: YouTube (single) o Archivo (múltiple)
  const [tituloYoutube, setTituloYoutube] = useState('')
  const [idYoutube, setIdYoutube] = useState('')
  const [items, setItems] = useState([])

  const [guardando, setGuardando] = useState(false)
  const [progreso, setProgreso] = useState('')
  const [error, setError] = useState('')

  const extraerIdYoutube = (texto) => {
    const match = texto.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : texto.trim()
  }

  const manejarSeleccionArchivos = (e) => {
    const archivos = Array.from(e.target.files)
    setItems(archivos.map((file) => ({ file, titulo: nombreSinExtension(file.name) })))
  }

  const actualizarTituloItem = (index, nuevoTitulo) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, titulo: nuevoTitulo } : item)))
  }

  const quitarItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const subirYObtenerUrl = async (supabase, file) => {
    const nombreArchivo = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
    const { error: errorSubida } = await supabase.storage.from('videos').upload(nombreArchivo, file)
    if (errorSubida) throw new Error(errorSubida.message)
    const { data } = supabase.storage.from('videos').getPublicUrl(nombreArchivo)
    return data.publicUrl
  }

  // ---------- EDICIÓN ----------
  const manejarEnvioEdicion = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)

    const supabase = createClient()
    let urlVideo = videoExistente.url_video

    try {
      if (tipoFuente === 'youtube') {
        urlVideo = extraerIdYoutube(idYoutubeEdicion)
      } else if (archivoEdicion) {
        urlVideo = await subirYObtenerUrl(supabase, archivoEdicion)
      }

      const { error: errorGuardado } = await supabase
        .from('videos')
        .update({
          titulo: tituloEdicion,
          descripcion,
          categoria_id: categoriaId || null,
          anio: anio ? parseInt(anio) : null,
          tipo_fuente: tipoFuente,
          url_video: urlVideo,
        })
        .eq('id', videoExistente.id)

      if (errorGuardado) throw new Error(errorGuardado.message)

      router.push('/admin/videos')
      router.refresh()
    } catch (err) {
      setError('Error al guardar: ' + err.message)
      setGuardando(false)
    }
  }

  // ---------- CREACIÓN ----------
  const manejarEnvioCreacion = async (e) => {
    e.preventDefault()
    setError('')

    const supabase = createClient()
    const { data: usuario } = await supabase.auth.getUser()

    // --- YouTube: un solo registro ---
    if (tipoFuente === 'youtube') {
      if (!idYoutube.trim()) {
        setError('Debes ingresar el link o ID del video de YouTube.')
        return
      }
      if (!tituloYoutube.trim()) {
        setError('Debes ingresar un título.')
        return
      }

      setGuardando(true)
      const { error: errorInsert } = await supabase.from('videos').insert({
        titulo: tituloYoutube,
        descripcion,
        categoria_id: categoriaId || null,
        anio: anio ? parseInt(anio) : null,
        tipo_fuente: 'youtube',
        url_video: extraerIdYoutube(idYoutube),
        subida_por: usuario.user?.id,
      })

      setGuardando(false)
      if (errorInsert) {
        setError('Error al guardar: ' + errorInsert.message)
        return
      }

      router.push('/admin/videos')
      router.refresh()
      return
    }

    // --- Archivo: uno o varios registros ---
    if (items.length === 0) {
      setError('Debes seleccionar al menos un archivo de video.')
      return
    }

    setGuardando(true)
    let exitosos = 0
    const errores = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      setProgreso(`Subiendo ${i + 1} de ${items.length}: ${item.titulo || item.file.name}`)

      try {
        const urlVideo = await subirYObtenerUrl(supabase, item.file)
        const { error: errorInsert } = await supabase.from('videos').insert({
          titulo: item.titulo || nombreSinExtension(item.file.name),
          descripcion,
          categoria_id: categoriaId || null,
          anio: anio ? parseInt(anio) : null,
          tipo_fuente: 'archivo',
          url_video: urlVideo,
          subida_por: usuario.user?.id,
        })
        if (errorInsert) throw new Error(errorInsert.message)
        exitosos++
      } catch (err) {
        errores.push(`${item.file.name}: ${err.message}`)
      }
    }

    setProgreso('')
    setGuardando(false)

    if (errores.length > 0) {
      setError(`Se subieron ${exitosos} de ${items.length} videos. Errores: ${errores.join(' | ')}`)
      return
    }

    router.push('/admin/videos')
    router.refresh()
  }

  const camposCompartidos = (
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
  )

  // ================= MODO EDICIÓN =================
  if (esEdicion) {
    return (
      <form onSubmit={manejarEnvioEdicion} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-semibold text-institucional-azul">Título *</label>
          <input
            type="text"
            required
            value={tituloEdicion}
            onChange={(e) => setTituloEdicion(e.target.value)}
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

        {camposCompartidos}

        <div>
          <label className="block text-sm font-semibold text-institucional-azul">Fuente del video *</label>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" checked={tipoFuente === 'youtube'} onChange={() => setTipoFuente('youtube')} />
              YouTube
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={tipoFuente === 'archivo'} onChange={() => setTipoFuente('archivo')} />
              Archivo
            </label>
          </div>
        </div>

        {tipoFuente === 'youtube' ? (
          <div>
            <label className="block text-sm font-semibold text-institucional-azul">Link o ID de YouTube *</label>
            <input
              type="text"
              value={idYoutubeEdicion}
              onChange={(e) => setIdYoutubeEdicion(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-institucional-azul">Reemplazar archivo (opcional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setArchivoEdicion(e.target.files[0])}
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
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    )
  }

  // ================= MODO CREACIÓN =================
  return (
    <form onSubmit={manejarEnvioCreacion} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-semibold text-institucional-azul">Fuente del video *</label>
        <div className="mt-1 flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" checked={tipoFuente === 'youtube'} onChange={() => setTipoFuente('youtube')} />
            YouTube
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={tipoFuente === 'archivo'} onChange={() => setTipoFuente('archivo')} />
            Subir archivo(s)
          </label>
        </div>
      </div>

      {tipoFuente === 'youtube' ? (
        <>
          <div>
            <label className="block text-sm font-semibold text-institucional-azul">Título *</label>
            <input
              type="text"
              value={tituloYoutube}
              onChange={(e) => setTituloYoutube(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-institucional-azul">Link o ID de YouTube *</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={idYoutube}
              onChange={(e) => setIdYoutube(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-semibold text-institucional-azul">
              Archivos de video * (puedes seleccionar varios a la vez)
            </label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={manejarSeleccionArchivos}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />
          </div>

          {items.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-sm font-semibold text-institucional-azul">
                {items.length} {items.length === 1 ? 'video seleccionado' : 'videos seleccionados'}
              </p>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-md bg-white p-2 shadow-sm">
                    <span className="shrink-0 text-2xl">🎬</span>
                    <input
                      type="text"
                      value={item.titulo}
                      onChange={(e) => actualizarTituloItem(index, e.target.value)}
                      placeholder="Título de este video"
                      className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-institucional-azul focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => quitarItem(index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-institucional-gris">
        La descripción, categoría y año se aplicarán a todos los videos seleccionados.
      </p>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">Descripción (opcional, compartida)</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      {camposCompartidos}

      {progreso && <p className="text-sm text-institucional-azul">{progreso}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {guardando
          ? 'Guardando...'
          : tipoFuente === 'archivo' && items.length > 1
          ? `Subir ${items.length} videos`
          : 'Agregar video'}
      </button>
    </form>
  )
}