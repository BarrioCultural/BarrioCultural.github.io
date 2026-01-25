import MapaInteractivo from '/recursos/boxes/MapaInteractivo';
import Link from 'next/link';

export default function PaginaMapa() {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Un pequeño menú para volver atrás */}
      <nav className="p-4 bg-white shadow-sm flex justify-between items-center">
        <Link href="/">
          <a className="text-amber-900 font-bold">"← Volver a la Wiki"</a>
        </Link>
        <h1 className="text-xl font-serif">"Cartografía de mi Mundo"</h1>
        <div className="w-20"></div> {/* Espaciador para centrar el título */}
      </nav>

      {/* El Mapa ocupando el centro */}
      <main className="flex-grow flex items-center justify-center p-4">
        <MapaInteractivo />
      </main>
      
      <footer className="p-4 text-center text-gray-500 text-sm">
        "Haz clic en los puntos para descubrir los secretos de mis personajes."
      </footer>
    </div>
  );
}