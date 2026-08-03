import InformacionContacto from '@/components/informacioncontacto'
import FormularioContacto from '@/components/formulariocontacto'
import MapaUbicacion from '@/components/mapaubicacion'

export const metadata = {
  title: 'Contacto | Biblioteca Digital INEDHUMAC',
}

export default function PaginaContacto() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-institucional-azul">
        Contacto
      </h1>
      <p className="mb-10 text-institucional-gris">
        ¿Tienes una sugerencia o comentario? Escríbenos.
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-8">
          <InformacionContacto />
          <MapaUbicacion />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <FormularioContacto />
        </div>
      </div>
    </main>
  )
}