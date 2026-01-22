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
      <body className={`${montserrat.className} antialiased bg-[#F0F0F0]`}>
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