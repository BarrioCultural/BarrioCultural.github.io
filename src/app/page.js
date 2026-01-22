"use client"; // Añade esto si vas a usar animaciones o interactividad

import SobreMi from '@/components/paginas/sobre-mi';
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 pb-20 px-4 flex justify-center "
    >
      <SobreMi />
    </motion.main>
  );
}