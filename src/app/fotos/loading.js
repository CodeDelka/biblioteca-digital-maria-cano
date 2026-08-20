export default function CargandoFotos() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-2 h-9 w-64 animate-pulse rounded-md bg-gray-200" />
      <div className="mb-10 h-5 w-96 animate-pulse rounded-md bg-gray-200" />

      <div className="mb-4 h-6 w-40 animate-pulse rounded-md bg-gray-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </main>
  )
}