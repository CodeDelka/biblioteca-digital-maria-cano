export default function CargandoHistoria() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto mb-2 h-9 w-64 animate-pulse rounded-md bg-gray-200" />
      <div className="mx-auto mb-12 h-5 w-96 animate-pulse rounded-md bg-gray-200" />

      <div className="relative mx-auto max-w-3xl space-y-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`flex flex-col gap-4 sm:flex-row ${
              i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
            }`}
          >
            <div
              className={`ml-10 w-full sm:ml-0 sm:w-1/2 ${
                i % 2 === 0 ? 'sm:pr-10' : 'sm:pl-10'
              }`}
            >
              <div className="h-40 animate-pulse rounded-lg bg-gray-200" />
            </div>
            <div className="hidden sm:block sm:w-1/2" />
          </div>
        ))}
      </div>
    </main>
  )
}