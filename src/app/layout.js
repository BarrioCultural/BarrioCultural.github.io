import { LightboxProvider } from "@/components/lightbox"; 
import { AuthProvider } from "@/components/authContext"; // 1. Importa el nuevo contexto
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
        <AuthProvider>
          <LightboxProvider>
            <AppLogic>
              {children}
            </AppLogic>
          </LightboxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}