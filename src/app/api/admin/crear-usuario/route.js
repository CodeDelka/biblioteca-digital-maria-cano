import { createClient } from '@supabase/supabase-js'
import { createClient as createClienteServidor } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  // 1. Verificar que quien hace la petición sea un super_admin autenticado
  const supabaseServidor = await createClienteServidor()
  const { data: { user } } = await supabaseServidor.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
  }

  const { data: perfil } = await supabaseServidor
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'super_admin') {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  // 2. Leer los datos del nuevo admin
  const { nombreCompleto, email, password } = await request.json()

  if (!nombreCompleto || !email || !password) {
    return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 })
  }

  // 3. Usar la Service Role Key para crear el usuario (solo posible en el servidor)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: nuevoUsuario, error: errorCreacion } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // lo confirma automáticamente, sin necesidad de verificar correo
  })

  if (errorCreacion) {
    return NextResponse.json({ error: errorCreacion.message }, { status: 400 })
  }

  // 4. Crear su registro en la tabla profiles
  const { error: errorPerfil } = await supabaseAdmin.from('profiles').insert({
    id: nuevoUsuario.user.id,
    nombre_completo: nombreCompleto,
    email,
    rol: 'admin',
    activo: true,
  })

  if (errorPerfil) {
    return NextResponse.json({ error: errorPerfil.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}