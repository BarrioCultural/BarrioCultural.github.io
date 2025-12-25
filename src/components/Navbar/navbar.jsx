"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Función para cerrar el menú al hacer clic en un enlace
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav__logo">Franilover</div>

        {/* El checkbox ahora está controlado por el estado de React */}
        <input 
          type="checkbox" 
          id="menu-toggle" 
          checked={isOpen} 
          onChange={() => setIsOpen(!isOpen)} 
        />
        
        <label htmlFor="menu-toggle" className="nav__toggle" aria-label="Abrir menú">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <ul className="nav__menu">
          {/* INICIO */}
          <li className="item-inicio">
            <Link 
              href="/" 
              onClick={closeMenu} 
              className={currentPath === '/' ? 'active' : ''}
            >
              Inicio
            </Link>
          </li>
          
          {/* PERSONAL */}
          <li className="dropdown item-personal">
            <span className="dropdown-btn">Personal ▾</span>
            <ul className="dropdown-content">
              <li>
                {/* Ajustado a /dibujos según tu carpeta */}
                <Link href="/dibujos" onClick={closeMenu} className={currentPath === '/dibujos' ? 'active' : ''}>
                  Dibujos
                </Link>
              </li>
              <li>
                {/* Ajustado a /fotos según tu carpeta */}
                <Link href="/fotos" onClick={closeMenu} className={currentPath === '/fotos' ? 'active' : ''}>
                  Fotos
                </Link>
              </li>
              <li>
                <Link href="/contacto" onClick={closeMenu} className={currentPath === '/contacto' ? 'active' : ''}>
                  Contacto
                </Link>
              </li>
              <li>
                <a href="https://www.youtube.com/@franilover" target="_blank" rel="noreferrer" onClick={closeMenu}>
                  Ensayos
                </a>
              </li>
            </ul>
          </li>

          {/* GARDEN OF SINS */}
          <li className="dropdown item-garden">
            <span className="dropdown-btn">Garden of Sins ▾</span>
            <ul className="dropdown-content">
              <li>
                {/* Ajustado a /personajes según tu carpeta */}
                <Link href="/personajes" onClick={closeMenu} className={currentPath === '/personajes' ? 'active' : ''}>
                  Personajes
                </Link>
              </li>
              <li>
                <a href="https://www.youtube.com/@franilover" target="_blank" rel="noreferrer" onClick={closeMenu}>
                  Animaciones
                </a>
              </li>
            </ul>
          </li> 
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;