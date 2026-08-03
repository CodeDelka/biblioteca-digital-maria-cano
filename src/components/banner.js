import Link from 'next/link'
import BannerCarousel from './bannercarousel'

export default function Banner() {
  return (
    <section className="relative flex h-[70vh] min-h-[420px] w-full items-center justify-center overflow-hidden">
      {/* Carrusel de imágenes de fondo */}
      <BannerCarousel />

      {/* Capa oscura para que el texto se lea bien (por encima del carrusel) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-institucional-azul/85 via-institucional-azul/40 to-transparent" />

      {/* Contenido del banner (por encima de todo) */}
      <div className="relative z-20 mx-auto max-w-3xl px-4 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Biblioteca Digital Institucional de la I.E.D. Bilingüe María Cano
        </h1>
        <p className="mt-4 text-lg text-white/90 sm:text-xl">
          Preservando y compartiendo la memoria histórica, académica, cultural
          y deportiva de nuestra institución.
        </p>
        <Link
          href="/fotos"
          className="mt-8 inline-block rounded-lg bg-institucional-amarillo px-8 py-3 font-semibold text-institucional-gris shadow-lg transition hover:brightness-95"
        >
          Comenzar a explorar
        </Link>
      </div>
    </section>
  )
}