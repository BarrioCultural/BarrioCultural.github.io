import { LightboxProvider } from "@/components/lightbox"; 
import AppLogic from "./AppLogic";
import "@/components/tailwind.css"; 

export const metadata = {
  title: 'Franilover',
  description: 'Mi Nexus personal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Todo lo que esté dentro de LightboxProvider tendrá acceso al openLightbox */}
        <LightboxProvider>
          <AppLogic>
            {children}
          </AppLogic>
        </LightboxProvider>
      </body>
    </html>
  );
}