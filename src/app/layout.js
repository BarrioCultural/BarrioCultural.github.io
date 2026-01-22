import { LightboxProvider } from "@/components/recursos/boxes/lightbox"; 
import { AuthProvider } from "@/components/recursos/control/authContext"; 
import AppLogic from "./AppLogic";
import "@/components/tailwind.css"; 
// 1. Importa la fuente oficial de Next.js para optimizar el CLS (Cumulative Layout Shift)
import { Montserrat } from 'next/font/google';

// Configura la fuente (puedes elegir la que más te guste, Montserrat es muy limpia)
const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat', // Permite usarla en CSS como var(--font-montserrat)
});

export const metadata = {
  title: 'Franilover',
  description: 'Mi Nexus personal',
  // 2. Configuración para que el sitio se sienta como una App nativa en móvil
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, // Evita el zoom automático al hacer click en inputs
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={montserrat.variable}>
      {/* 3. Aplicamos la fuente al body para que no haya parpadeos de texto */}
      <body className={`${montserrat.className} antialiased`}>
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