'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function nombreSinExtension(nombreArchivo) {
  return nombreArchivo.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
}

export default function FormularioFoto({ categorias, fotoExistente }) {
  const router = useRouter()
  const esEdicion = Boolean(fotoExistente)

  // Campos compartidos (aplican a todas las fotos del lote al crear)
  const [descripcion, setDescripcion] = useState(fotoExistente?.descripcion || '')
  const [categoriaId, setCategoriaId] = useState(fotoExistente?.categoria_id || '')
  const [anio, setAnio] = useState(fotoExistente?.anio || '')

  // Modo edición: un solo título y un solo archivo opcional
  const [tituloEdicion, setTituloEdicion] = useState(fotoExistente?.titulo || '')
  const [archivoEdicion, setArchivoEdicion] = useState(null)

  // Modo creación: lista de archivos con su propio título editable
  const [items, setItems] = useState([])

  const [guardando, setGuardando] = useState(false)
  const [progreso, setProgreso] = useState('')
  const [error, setError] = useState('')

  const manejarSeleccionArchivos = (e) => {
    const archivos = Array.from(e.target.files)
    const nuevosItems = archivos.map((file) => ({
      file,
      titulo: nombreSinExtension(file.name),
    }))
    setItems(nuevosItems)
  }

  const actualizarTituloItem = (index, nuevoTitulo) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, titulo: nuevoTitulo } : item))
    )
  }

  const quitarItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const subirYObtenerUrl = async (supabase, file) => {
    const nombreArchivo = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
    const { error: errorSubida } = await supabase.storage.from('fotos').upload(nombreArchivo, file)
    if (errorSubida) throw new Error(errorSubida.message)
    const { data } = supabase.storage.from('fotos').getPublicUrl(nombreArchivo)
    return data.publicUrl
  }

  // ---------- Envío en modo EDICIÓN (una sola foto) ----------
  const manejarEnvioEdicion = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)

    const supabase = createClient()
    let urlImagen = fotoExistente.url_imagen

    try {
      if (archivoEdicion) {
        urlImagen = await subirYObtenerUrl(supabase, archivoEdicion)
      }

      const { error: errorGuardado } = await supabase
        .from('fotos')
        .update({
          titulo: tituloEdicion,
          descripcion,
          categoria_id: categoriaId || null,
          anio: anio ? parseInt(anio) : null,
          url_imagen: urlImagen,
        })
        .eq('id', fotoExistente.id)

      if (errorGuardado) throw new Error(errorGuardado.message)

      router.push('/admin/fotos')
      router.refresh()
    } catch (err) {
      setError('Error al guardar: ' + err.message)
      setGuardando(false)
    }
  }

  // ---------- Envío en modo CREACIÓN (una o varias fotos) ----------
  const manejarEnvioCreacion = async (e) => {
    e.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Debes seleccionar al menos una imagen.')
      return
    }

    setGuardando(true)
    const supabase = createClient()
    const { data: usuario } = await supabase.auth.getUser()

    let exitosas = 0
    const errores = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      setProgreso(`Subiendo ${i + 1} de ${items.length}: ${item.titulo || item.file.name}`)

      try {
        const urlImagen = await subirYObtenerUrl(supabase, item.file)
        const { error: errorInsert } = await supabase.from('fotos').insert({
          titulo: item.titulo || nombreSinExtension(item.file.name),
          descripcion,
          categoria_id: categoriaId || null,
          anio: anio ? parseInt(anio) : null,
          url_imagen: urlImagen,
          subida_por: usuario.user?.id,
        })
        if (errorInsert) throw new Error(errorInsert.message)
        exitosas++
      } catch (err) {
        errores.push(`${item.file.name}: ${err.message}`)
      }
    }

    setProgreso('')
    setGuardando(false)

    if (errores.length > 0) {
      setError(
        `Se subieron ${exitosas} de ${items.length} fotos. Errores: ${errores.join(' | ')}`
      )
      return
    }

    router.push('/admin/fotos')
    router.refresh()
  }

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
          <label className="block text-sm font-semibold text-institucional-azul">
            Reemplazar imagen (opcional)
          </label>
          {fotoExistente?.url_imagen && (
            <img src={fotoExistente.url_imagen} alt="Actual" className="mt-2 h-24 w-24 rounded-md object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setArchivoEdicion(e.target.files[0])}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>

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

  // ================= MODO CREACIÓN (una o varias) =================
  return (
    <form onSubmit={manejarEnvioCreacion} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-semibold text-institucional-azul">
          Imágenes * (puedes seleccionar varias a la vez)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={manejarSeleccionArchivos}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
        />
      </div>

      {items.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-semibold text-institucional-azul">
            {items.length} {items.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
          </p>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 rounded-md bg-white p-2 shadow-sm">
                <img
                  src={URL.createObjectURL(item.file)}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded object-cover"
                />
                <input
                  type="text"
                  value={item.titulo}
                  onChange={(e) => actualizarTituloItem(index, e.target.value)}
                  placeholder="Título de esta foto"
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

      <p className="text-xs text-institucional-gris">
        La descripción, categoría y año que definas abajo se aplicarán a todas las fotos seleccionadas.
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

      {progreso && <p className="text-sm text-institucional-azul">{progreso}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={guardando || items.length === 0}
        className="rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {guardando
          ? 'Subiendo...'
          : items.length > 1
          ? `Subir ${items.length} fotos`
          : 'Subir foto'}
      </button>
    </form>
  )
}