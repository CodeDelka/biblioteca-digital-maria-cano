'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

const imagenes = ['/evento.jpg', '/evento2.jpeg', '/evento3.jpeg', '/evento4.jpeg']
const INTERVALO_MS = 3000

export default function BannerCarousel() {
  const [indice, setIndice] = useState(0)
  const [arrastreX, setArrastreX] = useState(0)
  const [arrastrando, setArrastrando] = useState(false)
  const inicioX = useRef(0)
  const timerRef = useRef(null)

  const irASiguiente = useCallback(() => {
    setIndice((prev) => (prev + 1) % imagenes.length)
  }, [])

  const irAAnterior = useCallback(() => {
    setIndice((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }, [])

  // Auto-avance cada 3 segundos, se reinicia si el usuario interactúa
  const reiniciarTemporizador = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(irASiguiente, INTERVALO_MS)
  }, [irASiguiente])

  useEffect(() => {
    reiniciarTemporizador()
    return () => clearInterval(timerRef.current)
  }, [reiniciarTemporizador])

  // --- Manejo de arrastre / swipe (mouse y táctil) ---
  const manejarInicio = (clientX) => {
    setArrastrando(true)
    inicioX.current = clientX
    clearInterval(timerRef.current)
  }

  const manejarMovimiento = (clientX) => {
    if (!arrastrando) return
    setArrastreX(clientX - inicioX.current)
  }

  const manejarFin = () => {
    const umbral = 60 // px mínimos para considerar que fue un swipe intencional

    if (arrastreX > umbral) {
      irAAnterior()
    } else if (arrastreX < -umbral) {
      irASiguiente()
    }

    setArrastrando(false)
    setArrastreX(0)
    reiniciarTemporizador()
  }

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden select-none"
      onMouseDown={(e) => manejarInicio(e.clientX)}
      onMouseMove={(e) => manejarMovimiento(e.clientX)}
      onMouseUp={manejarFin}
      onMouseLeave={() => arrastrando && manejarFin()}
      onTouchStart={(e) => manejarInicio(e.touches[0].clientX)}
      onTouchMove={(e) => manejarMovimiento(e.touches[0].clientX)}
      onTouchEnd={manejarFin}
    >
      {/* Contenedor deslizante */}
      <div
        className={`flex h-full ${arrastrando ? '' : 'transition-transform duration-700 ease-out'}`}
        style={{
          width: `${imagenes.length * 100}%`,
          transform: `translateX(calc(-${indice * (100 / imagenes.length)}% + ${arrastreX}px))`,
        }}
      >
        {imagenes.map((src, i) => (
          <div
            key={src}
            className="relative h-full"
            style={{ width: `${100 / imagenes.length}%` }}
          >
            <Image
              src={src}
              alt={`Evento institucional ${i + 1}`}
              fill
              priority={i === 0}
              draggable={false}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Flechas de navegación (solo visibles en pantallas medianas+) */}
      <button
        onClick={() => {
          irAAnterior()
          reiniciarTemporizador()
        }}
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur transition hover:bg-white/50 md:block"
        aria-label="Imagen anterior"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => {
          irASiguiente()
          reiniciarTemporizador()
        }}
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur transition hover:bg-white/50 md:block"
        aria-label="Siguiente imagen"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores (puntos) */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {imagenes.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndice(i)
              reiniciarTemporizador()
            }}
            aria-label={`Ir a la imagen ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === indice ? 'bg-institucional-amarillo' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}