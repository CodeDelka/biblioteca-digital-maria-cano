import Banner from '@/components/banner'
import AccesosRapidos from '@/components/accesosrapidos'
import NoticiasRecientes from '@/components/noticiasrecientes'

export default function Home() {
  return (
    <main>
      <Banner />

      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-institucional-azul sm:text-3xl">
          ¿Qué es la Biblioteca Digital?
        </h2>
        <p className="mt-4 text-lg text-institucional-gris">
          Un espacio creado para que estudiantes, docentes, egresados y
          padres de familia puedan consultar fotografías, videos, documentos
          y proyectos desarrollados a lo largo de la historia del colegio.
        </p>
      </section>

      <AccesosRapidos />
      <NoticiasRecientes />
    </main>
  )
}