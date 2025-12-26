export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-sky-400">
          Tailwind funcionando
        </h1>
        <p className="mt-2 text-slate-400">
          Este es un proyecto de Next.js usando <b>JavaScript</b> y Sass.
        </p>
        <button className="mt-6 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors">
          ¡Genial!
        </button>
      </div>
    </div>
  );
}