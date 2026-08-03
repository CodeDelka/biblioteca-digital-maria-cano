'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function PaginaLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const manejarLogin = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    const supabase = createClient()
    const { error: errorLogin } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (errorLogin) {
      setError('Correo o contraseña incorrectos.')
      setCargando(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center">
          <Image src="/logo.png" alt="Logo INEDHUMAC" width={64} height={64} />
          <h1 className="mt-4 text-xl font-bold text-institucional-azul">
            Panel Administrativo
          </h1>
          <p className="text-sm text-institucional-gris">Biblioteca Digital INEDHUMAC</p>
        </div>

        <form onSubmit={manejarLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-institucional-azul">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-institucional-azul">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-institucional-azul focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-institucional-azul px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )
}