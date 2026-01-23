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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, 
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body 
        className={`${montserrat.className} antialiased bg-[#F0F0F0]`}
        // "Opcional: Esto evita el clic derecho en TODA la web"
        onContextMenu={(e) => e.preventDefault()} 
      >
        <AuthProvider>
          <LightboxProvider>
            <AppLogic>
              {children}
            </AppLogic>
            
            {/* "AVISO LEGAL AL PIE DE PÁGINA" */}
            <footer style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#666', 
              fontSize: '0.8rem',
              borderTop: '1px solid #ddd',
              marginTop: 'auto'
            }}>
              "© 2026 Franilover. Todos los derechos reservados. 
              Queda prohibido el uso de mis ilustraciones para fines comerciales o 
              entrenamiento de IA sin autorización."
            </footer>

          </LightboxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}