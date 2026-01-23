import { LightboxProvider } from "@/components/recursos/boxes/lightbox"; 
import { AuthProvider } from "@/components/recursos/control/authContext"; 
import AppLogic from "./AppLogic";
import "@/components/tailwind.css"; 
import { Montserrat } from 'next/font/google';
import dynamic from 'next/dynamic'; // "Importamos la herramienta de carga dinámica"

// "Cargamos ControlHooks desactivando el Server-Side Rendering (ssr: false)"
const ControlHooks = dynamic(() => import("@/components/recursos/control/controlHooks"), {
  ssr: false, 
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

// "Metadata limpia (sin viewport)"
export const metadata = {
  title: 'Franilover',
  description: 'Mi Nexus personal',
};

// "Configuración de Viewport (API oficial de Next.js 16)"
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, 
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className={`${montserrat.className} antialiased bg-[#F0F0F0] min-h-screen flex flex-col`}>
        
        {/* "Ahora se ejecutará de forma segura solo en el navegador" */}
        <ControlHooks /> 
        
        <AuthProvider>
          <LightboxProvider>
            <div className="flex-grow">
              <AppLogic>
                {children}
              </AppLogic>
            </div>
            
            <footer className="w-full py-6 mt-auto text-center border-t border-gray-300 bg-white/50 backdrop-blur-sm">
              <p className="text-gray-600 text-xs sm:text-sm px-4">
                "© 2026 Franilover. Todos los derechos reservados. 
                Queda estrictamente prohibido el uso o reproducción de las ilustraciones 
                para fines comerciales o entrenamiento de modelos de IA sin autorización."
              </p>
            </footer>
          </LightboxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}