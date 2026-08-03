import FormularioProyecto from '@/components/admin/formularioproyecto'

export default function NuevoProyecto() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-institucional-azul">Nuevo proyecto</h1>
      <p className="mb-6 text-sm text-institucional-gris">
        Primero guarda los datos básicos; después podrás agregar integrantes.
      </p>
      <FormularioProyecto />
    </div>
  )
}