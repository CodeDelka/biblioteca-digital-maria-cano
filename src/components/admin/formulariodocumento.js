'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const tiposDocumento = [
  'Manual de convivencia',
  'Constitución Política',
  'Reglamento',
  'Informe',
  'Documento institucional',
  'Historia',
  'Otro',
]

export default function FormularioDocumento({ documentoExistente }) {
  const router = useRouter()
  const esEdicion = Boolean(documentoExistente)

  const [titulo, setTitulo] = useState(documentoExistente?.titulo || '')
  const [descripcion, setDescripcion] = useState(documentoExistente?.descripcion || '')
  const [tipoDocumento, setTipoDocumento] = useState(documentoExistente?.tipo_documento || tiposDocumento[0])
  const [anio, setAnio] = useState(documentoExistente?.anio || '')
  const [archivo, setArchivo] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')

    if (!esEdicion && !archivo) {
      setError('Debes seleccionar un archivo PDF.')
      return
    }

    setGuardando(true)
    const supabase = createClient()
    let urlArchivo = documentoExistente?.url_archivo || null

    if (archivo) {
      const nombreArchivo = `${Date.now()}-${archivo.name}`
      const { error: errorSubida } = await supabase.storage
        .from('documentos')
        .upload(nombreArchivo, archivo)

      if (errorSubida) {
        setError('Error al subir el archivo: ' + errorSubida.message)
        setGuardando(false)
        return
      }

      const { data: urlPublica } = supabase.storage.from('documentos').getPublicUrl(nombreArchivo)
      urlArchivo = urlPublica.publicUrl
    }

    const datosDocumento = {
      titulo,
      descripcion,
      tipo_documento: tipoDocumento,
      anio: anio ? parseInt(anio) : null,
      url_archivo: urlArchivo,
    }

    let errorGuardado
    if (esEdicion) {
      const { error } = await supabase
        .from('documentos')
        .update(datosDocumento)
        .eq('id', documentoExistente.id)
      errorGuardado = error
    } else {
      const { data: usuario } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('documentos')
        .insert({ ...datosDocumento, subida_por: usuario.user?.id })
      errorGuardado = error
    }

    if (errorGuardado) {
      setError('Error al guardar: ' + errorGuardado.message)
      setGuardando(false)
      return
    }

    router.push('/admin/documentos')
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
          <label className="block text-sm font-semibold text-institucional-azul">Tipo de documento</label>
          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
          >
            {tiposDocumento.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
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
          {esEdicion ? 'Reemplazar archivo (opcional)' : 'Archivo PDF *'}
        </label>
        {esEdicion && documentoExistente?.url_archivo && (
          <a
            href={documentoExistente.url_archivo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-institucional-azul hover:underline"
          >
            Ver archivo actual
          </a>
        )}
        <input
          type="file"
          accept="application/pdf"
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
        {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Subir documento'}
      </button>
    </form>
  )
}