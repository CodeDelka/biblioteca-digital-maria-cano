import "./globals.css";
import Navbar from "@/components/navbar";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  metadataBase: new URL("https://biblioteca-digital-maria-cano.vercel.app"),
  title: {
    default: "Biblioteca Digital INEDHUMAC",
    template: "%s | Biblioteca Digital INEDHUMAC",
  },
  description:
    "Biblioteca Digital Institucional de la I.E.D. Bilingüe María Cano: fotografías, videos, documentos, historia y proyectos educativos.",
  verification: {
    google: "SG11dnA-2kb-NUp733JPPuNhmZHF3k5GAfOvYqJjW1E",
  },
  openGraph: {
    title: "Biblioteca Digital INEDHUMAC",
    description:
      "Preservando y compartiendo la memoria histórica, académica, cultural y deportiva de la I.E.D. Bilingüe María Cano.",
    url: "https://biblioteca-digital-maria-cano.vercel.app",
    siteName: "Biblioteca Digital INEDHUMAC",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Logo INEDHUMAC",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Biblioteca Digital INEDHUMAC",
    description:
      "Fotografías, videos, documentos, historia y proyectos educativos de la I.E.D. Bilingüe María Cano.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}