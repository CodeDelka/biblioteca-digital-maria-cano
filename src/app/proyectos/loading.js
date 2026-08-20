export default function CargandoProyectos() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-2 h-9 w-64 animate-pulse rounded-md bg-gray-200" />
      <div className="mb-10 h-5 w-96 animate-pulse rounded-md bg-gray-200" />

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="h-6 w-1/2 animate-pulse rounded-md bg-gray-200" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded-md bg-gray-200" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}