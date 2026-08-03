import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata = {
  title: "Biblioteca Digital INEDHUMAC",
  description:
    "Biblioteca Digital Institucional de la I.E.D. Bilingüe María Cano",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}