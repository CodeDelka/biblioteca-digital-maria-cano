'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FormularioNuevoAdmin() {
  const router = useRouter()
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setExito(false)
    setGuardando(true)

    const respuesta = await fetch('/api/admin/crear-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreCompleto, email, password }),
    })

    const resultado = await respuesta.json()

    if (!respuesta.ok) {
      setError(resultado.error || 'Ocurrió un error.')
      setGuardando(false)
      return
    }

    setExito(true)
    setNombreCompleto('')
    setEmail('')
    setPassword('')
    setGuardando(false)
    router.refresh()
  }

  return (
    <form onSubmit={manejarEnvio} className="flex flex-wrap items-end gap-3">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-institucional-azul">Nombre completo</label>
        <input
          type="text"
          required
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-institucional-azul focus:outline-none"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-institucional-azul">Correo</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-institucional-azul focus:outline-none"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-institucional-azul">Contraseña temporal</label>
        <input
          type="text"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-institucional-azul focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={guardando}
        className="rounded-lg bg-institucional-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
      >
        {guardando ? 'Creando...' : 'Crear admin'}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
      {exito && <p className="w-full text-sm text-green-600">Administrador creado correctamente.</p>}
    </form>
  )
}