// app/layout.js
import { LightboxProvider } from "@/components/recursos/boxes/lightbox"; 
import { AuthProvider } from "@/components/recursos/control/authContext"; 
import AppLogic from "./AppLogic";
import "@/components/tailwind.css"; 
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Franilover',
  description: 'Mi Nexus personal',
};

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
        <AuthProvider>
          <LightboxProvider>
            <div className="flex-grow">
              <AppLogic>
                {children}
              </AppLogic>
            </div>
            
            <footer className="w-full py-6 mt-auto text-center border-t border-gray-300 bg-white/50">
              <p className="text-gray-600 text-[10px] sm:text-xs px-4">
                "© 2026 Franilover. Todos los derechos reservados. Prohibido el uso de estas ilustraciones para fines comerciales o IA."
              </p>
            </footer>
          </LightboxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}