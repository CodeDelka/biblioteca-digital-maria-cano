'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function TablaUsuariosAdmin({ usuarios }) {
  const router = useRouter()
  const [seleccionados, setSeleccionados] = useState([])
  const [procesando, setProcesando] = useState(false)

  // Solo se pueden seleccionar administradores normales, nunca super_admin
  const seleccionables = usuarios.filter((u) => u.rol !== 'super_admin')
  const todosSeleccionados = seleccionables.length > 0 && seleccionados.length === seleccionables.length

  const alternarTodos = () => setSeleccionados(todosSeleccionados ? [] : seleccionables.map((u) => u.id))
  const alternarUno = (id) =>
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))

  const cambiarEstadoSeleccionados = async (activo) => {
    const accion = activo ? 'activar' : 'desactivar'
    const confirmado = window.confirm(`¿Seguro que quieres ${accion} ${seleccionados.length} usuario(s)?`)
    if (!confirmado) return

    setProcesando(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ activo }).in('id', seleccionados)

    if (error) { alert('Error: ' + error.message); setProcesando(false); return }
    setSeleccionados([])
    setProcesando(false)
    router.refresh()
  }

  const cambiarEstadoUno = async (id, activoActual) => {
    const accion = activoActual ? 'desactivar' : 'activar'
    const confirmado = window.confirm(`¿Seguro que quieres ${accion} a este usuario?`)
    if (!confirmado) return

    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ activo: !activoActual }).eq('id', id)
    if (error) { alert('Error: ' + error.message); return }
    router.refresh()
  }

  return (
    <div>
      {seleccionados.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-institucional-azul px-4 py-2.5 text-white">
          <span className="text-sm font-medium">
            {seleccionados.length} usuario(s) seleccionado(s)
          </span>
          <div className="flex items-center gap-3">
            <button onClick={() => setSeleccionados([])} className="text-sm underline hover:text-institucional-amarillo">
              Cancelar
            </button>
            <button
              onClick={() => cambiarEstadoSeleccionados(true)}
              disabled={procesando}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              Activar
            </button>
            <button
              onClick={() => cambiarEstadoSeleccionados(false)}
              disabled={procesando}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              Desactivar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-institucional-azul">
            <tr>
              <th className="w-10 p-3">
                <input
                  type="checkbox"
                  checked={todosSeleccionados}
                  onChange={alternarTodos}
                  disabled={seleccionables.length === 0}
                  className="h-4 w-4 accent-institucional-azul"
                />
              </th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className={`border-t ${seleccionados.includes(usuario.id) ? 'bg-institucional-azul/5' : ''}`}>
                <td className="p-3">
                  {usuario.rol !== 'super_admin' && (
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(usuario.id)}
                      onChange={() => alternarUno(usuario.id)}
                      className="h-4 w-4 accent-institucional-azul"
                    />
                  )}
                </td>
                <td className="p-3 font-medium text-institucional-gris">{usuario.nombre_completo}</td>
                <td className="p-3 text-institucional-gris">{usuario.email}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    usuario.rol === 'super_admin' ? 'bg-institucional-amarillo text-institucional-azul' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {usuario.rol === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={usuario.activo ? 'text-green-600' : 'text-red-600'}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {usuario.rol !== 'super_admin' && (
                    <button
                      onClick={() => cambiarEstadoUno(usuario.id, usuario.activo)}
                      className={`font-medium hover:underline ${usuario.activo ? 'text-red-600' : 'text-green-600'}`}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}