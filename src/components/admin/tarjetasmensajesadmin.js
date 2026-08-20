'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function TarjetasMensajesAdmin({ mensajes }) {
  const router = useRouter()
  const [seleccionados, setSeleccionados] = useState([])
  const [procesando, setProcesando] = useState(false)

  const todosSeleccionados = mensajes.length > 0 && seleccionados.length === mensajes.length

  const alternarTodos = () => setSeleccionados(todosSeleccionados ? [] : mensajes.map((m) => m.id))
  const alternarUno = (id) =>
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))

  const marcarLeidosSeleccionados = async () => {
    setProcesando(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('mensajes_contacto')
      .update({ leido: true })
      .in('id', seleccionados)

    if (error) { alert('Error: ' + error.message); setProcesando(false); return }
    setSeleccionados([])
    setProcesando(false)
    router.refresh()
  }

  const eliminarSeleccionados = async () => {
    const etiqueta = seleccionados.length === 1 ? 'mensaje' : 'mensajes'
    const confirmado = window.confirm(`¿Eliminar ${seleccionados.length} ${etiqueta}?`)
    if (!confirmado) return

    setProcesando(true)
    const supabase = createClient()
    const { error } = await supabase.from('mensajes_contacto').delete().in('id', seleccionados)

    if (error) { alert('Error: ' + error.message); setProcesando(false); return }
    setSeleccionados([])
    setProcesando(false)
    router.refresh()
  }

  const marcarLeidoUno = async (id) => {
    const supabase = createClient()
    await supabase.from('mensajes_contacto').update({ leido: true }).eq('id', id)
    router.refresh()
  }

  const eliminarUno = async (id) => {
    const confirmado = window.confirm('¿Eliminar este mensaje?')
    if (!confirmado) return
    const supabase = createClient()
    await supabase.from('mensajes_contacto').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div>
      {mensajes.length > 0 && (
        <div className="mb-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-institucional-gris">
            <input type="checkbox" checked={todosSeleccionados} onChange={alternarTodos} className="h-4 w-4 accent-institucional-azul" />
            Seleccionar todos
          </label>
        </div>
      )}

      {seleccionados.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-institucional-azul px-4 py-2.5 text-white">
          <span className="text-sm font-medium">
            {seleccionados.length} {seleccionados.length === 1 ? 'mensaje seleccionado' : 'mensajes seleccionados'}
          </span>
          <div className="flex items-center gap-3">
            <button onClick={() => setSeleccionados([])} className="text-sm underline hover:text-institucional-amarillo">
              Cancelar
            </button>
            <button
              onClick={marcarLeidosSeleccionados}
              disabled={procesando}
              className="rounded-lg bg-institucional-amarillo px-3 py-1.5 text-sm font-semibold text-institucional-azul hover:brightness-95 disabled:opacity-50"
            >
              Marcar como leídos
            </button>
            <button
              onClick={eliminarSeleccionados}
              disabled={procesando}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              Eliminar seleccionados
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex gap-3 rounded-xl border p-4 shadow-sm ${
              mensaje.leido ? 'border-gray-200 bg-white' : 'border-institucional-azul bg-institucional-azul/5'
            }`}
          >
            <input
              type="checkbox"
              checked={seleccionados.includes(mensaje.id)}
              onChange={() => alternarUno(mensaje.id)}
              className="mt-1 h-4 w-4 shrink-0 accent-institucional-azul"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-institucional-azul">
                    {mensaje.nombre}
                    {!mensaje.leido && (
                      <span className="ml-2 rounded-full bg-institucional-amarillo px-2 py-0.5 text-xs font-bold text-institucional-azul">
                        Nuevo
                      </span>
                    )}
                  </p>
                  <a href={`mailto:${mensaje.email}`} className="text-sm text-institucional-gris hover:underline">
                    {mensaje.email}
                  </a>
                </div>
                <span className="shrink-0 text-xs text-institucional-gris">
                  {new Date(mensaje.creado_en).toLocaleDateString('es-CO')}
                </span>
              </div>

              <p className="mt-3 text-sm text-institucional-gris">{mensaje.mensaje}</p>

              <div className="mt-3 flex gap-4 text-sm">
                {!mensaje.leido && (
                  <button onClick={() => marcarLeidoUno(mensaje.id)} className="font-medium text-institucional-azul hover:underline">
                    Marcar como leído
                  </button>
                )}
                <button onClick={() => eliminarUno(mensaje.id)} className="font-medium text-red-600 hover:underline">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        {mensajes.length === 0 && (
          <p className="p-6 text-center text-institucional-gris">No hay mensajes recibidos aún.</p>
        )}
      </div>
    </div>
  )
}