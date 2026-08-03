export default function MapaUbicacion() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <iframe
        src="https://www.google.com/maps?q=Cra%208g%2035a%2083,%20Barranquilla&output=embed"
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación INEDHUMAC"
      />
    </div>
  )
}