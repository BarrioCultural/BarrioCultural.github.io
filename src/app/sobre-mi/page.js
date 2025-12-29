// app/sobre-mi/page.js
import SobreMi from '@/components/paginas/sobre-mi';

export default function Page() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex justify-center bg-bg-main">
      {/* Aquí llamas al componente que creamos arriba */}
      <SobreMi />
    </main>
  );
}