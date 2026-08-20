'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function TablaAdminSelectable({
  filas,              // [{ id, celdas: [ReactNode, ReactNode, ...], accionesExtra: ReactNode }]
  encabezados,        // ['Título', 'Categoría', 'Año']
  tabla,              // nombre de la tabla en Supabase, ej. 'fotos'
  etiquetaSingular,   // 'foto'
  etiquetaPlural,     // 'fotos'
  mensajeVacio,
}) {
  const router = useRouter()
  const [seleccionados, setSeleccionados] = useState([])
  const [eliminando, setEliminando] = useState(false)

  const todosSeleccionados = filas.length > 0 && seleccionados.length === filas.length

  const alternarTodos = () => setSeleccionados(todosSeleccionados ? [] : filas.map((f) => f.id))
  const alternarUno = (id) =>
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))

  const eliminarSeleccionados = async () => {
    const etiqueta = seleccionados.length === 1 ? etiquetaSingular : etiquetaPlural
    const confirmado = window.confirm(`¿Eliminar ${seleccionados.length} ${etiqueta}? Esta acción no se puede deshacer.`)
    if (!confirmado) return

    setEliminando(true)
    const supabase = createClient()
    const { error } = await supabase.from(tabla).delete().in('id', seleccionados)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      setEliminando(false)
      return
    }
    setSeleccionados([])
    setEliminando(false)
    router.refresh()
  }

  const eliminarUno = async (id) => {
    const confirmado = window.confirm(`¿Eliminar este ${etiquetaSingular}?`)
    if (!confirmado) return

    const supabase = createClient()
    const { error } = await supabase.from(tabla).delete().eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }
    router.refresh()
  }

  return (
    <div>
      {seleccionados.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-institucional-azul px-4 py-2.5 text-white">
          <span className="text-sm font-medium">
            {seleccionados.length} {seleccionados.length === 1 ? etiquetaSingular : etiquetaPlural} seleccionado(s)
          </span>
          <div className="flex items-center gap-3">
            <button onClick={() => setSeleccionados([])} className="text-sm underline hover:text-institucional-amarillo">
              Cancelar
            </button>
            <button
              onClick={eliminarSeleccionados}
              disabled={eliminando}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              {eliminando ? 'Eliminando...' : 'Eliminar seleccionados'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="w-10 p-3">
                <input type="checkbox" checked={todosSeleccionados} onChange={alternarTodos} className="h-4 w-4 accent-institucional-azul" />
              </th>
              {encabezados.map((encabezado) => (
                <th key={encabezado} className="p-3">{encabezado}</th>
              ))}
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id} className={`border-t ${seleccionados.includes(fila.id) ? 'bg-institucional-azul/5' : ''}`}>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(fila.id)}
                    onChange={() => alternarUno(fila.id)}
                    className="h-4 w-4 accent-institucional-azul"
                  />
                </td>
                {fila.celdas.map((celda, i) => (
                  <td key={i} className="p-3">{celda}</td>
                ))}
                <td className="p-3 text-right whitespace-nowrap">
                  {fila.accionesExtra}
                  <button onClick={() => eliminarUno(fila.id)} className="ml-3 text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filas.length === 0 && <p className="p-6 text-center text-institucional-gris">{mensajeVacio}</p>}
      </div>
    </div>
  )
}