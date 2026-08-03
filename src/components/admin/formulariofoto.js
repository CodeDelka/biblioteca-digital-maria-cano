'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function FormularioFoto({ categorias, fotoExistente }) {
  const router = useRouter()
  const esEdicion = Boolean(fotoExistente)

  const [titulo, setTitulo] = useState(fotoExistente?.titulo || '')
  const [descripcion, setDescripcion] = useState(fotoExistente?.descripcion || '')
  const [categoriaId, setCategoriaId] = useState(fotoExistente?.categoria_id || '')
  const [anio, setAnio] = useState(fotoExistente?.anio || '')
  const [archivo, setArchivo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')

    if (!esEdicion && !archivo) {
      setError('Debes seleccionar una imagen.')
      return
    }

    setGuardando(true)
    const supabase = createClient()
    let urlImagen = fotoExistente?.url_imagen || null

    // Si hay un archivo nuevo seleccionado, lo subimos a Storage
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

      const { data: urlPublica } = supabase.storage
        .from('fotos')
        .getPublicUrl(nombreArchivo)

      urlImagen = urlPublica.publicUrl
    }

    const datosFoto = {
      titulo,
      descripcion,
      categoria_id: categoriaId || null,
      anio: anio ? parseInt(anio) : null,
      url_imagen: urlImagen,
    }

    let errorGuardado
    if (esEdicion) {
      const { error } = await supabase
        .from('fotos')
        .update(datosFoto)
        .eq('id', fotoExistente.id)
      errorGuardado = error
    } else {
      const { data: usuario } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('fotos')
        .insert({ ...datosFoto, subida_por: usuario.user?.id })
      errorGuardado = error
    }

    if (errorGuardado) {
      setError('Error al guardar: ' + errorGuardado.message)
      setGuardando(false)
      return
    }

    router.push('/admin/fotos')
    router.refresh()
  }

  return (
    <form onSubmit={manejarEnvio} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-semibold text-institucional-azul">
          Título *
        </label>
        <input
          type="text"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-institucional-azul">
            Categoría
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
          >
            <option value="">Sin categoría</option>
            {categorias?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-institucional-azul">
            Año
          </label>
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
          {esEdicion ? 'Reemplazar imagen (opcional)' : 'Imagen *'}
        </label>
        {esEdicion && fotoExistente?.url_imagen && (
          <img
            src={fotoExistente.url_imagen}
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

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Subir foto'}
        </button>
      </div>
    </form>
  )
}