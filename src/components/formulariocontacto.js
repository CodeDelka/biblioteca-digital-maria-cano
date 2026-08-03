'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FormularioContacto() {
  const [formulario, setFormulario] = useState({ nombre: '', email: '', mensaje: '' })
  const [estado, setEstado] = useState('inactivo') // inactivo | enviando | exito | error

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setEstado('enviando')

    const supabase = createClient()
    const { error } = await supabase.from('mensajes_contacto').insert({
      nombre: formulario.nombre,
      email: formulario.email,
      mensaje: formulario.mensaje,
    })

    if (error) {
      console.error(error)
      setEstado('error')
      return
    }

    setEstado('exito')
    setFormulario({ nombre: '', email: '', mensaje: '' })
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-institucional-azul">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          required
          value={formulario.nombre}
          onChange={manejarCambio}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          required
          value={formulario.email}
          onChange={manejarCambio}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-institucional-azul">
          Mensaje o sugerencia
        </label>
        <textarea
          name="mensaje"
          required
          rows={4}
          value={formulario.mensaje}
          onChange={manejarCambio}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="w-full rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      {estado === 'exito' && (
        <p className="text-center font-medium text-green-600">
          ¡Gracias! Tu mensaje fue enviado correctamente.
        </p>
      )}
      {estado === 'error' && (
        <p className="text-center font-medium text-red-600">
          Ocurrió un error al enviar tu mensaje. Intenta de nuevo.
        </p>
      )}
    </form>
  )
}