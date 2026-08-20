export default function CargandoVideos() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-2 h-9 w-64 animate-pulse rounded-md bg-gray-200" />
      <div className="mb-10 h-5 w-96 animate-pulse rounded-md bg-gray-200" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-video animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </main>
  )
}