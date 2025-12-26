// Cambiamos la ruta para que coincida con tu imagen:
// src/components/resources/lightbox.js
import { LightboxProvider } from "../components/lightbox/lightbox"; 
import AppLogic from "./AppLogic";
import "../components/tailwind.css";


export const metadata = {
  title: 'Franilover',
  description: 'Mi Nexus personal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <LightboxProvider>
          <AppLogic>
            {children}
          </AppLogic>
        </LightboxProvider>
      </body>
    </html>
  );
}