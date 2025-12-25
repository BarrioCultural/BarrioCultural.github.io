// Cambiamos la ruta para que coincida con tu imagen:
// src/components/resources/lightbox.js
import { LightboxProvider } from "../components/resources/lightbox"; 
import AppLogic from "./AppLogic";

// Importa tu CSS principal aquí para que se aplique a toda la web
import "../components/main.scss"; 

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