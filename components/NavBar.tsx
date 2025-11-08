import React from 'react';

// Define las propiedades que podría recibir el NavBar, aunque sea solo para un título
interface NavBarProps {
  title?: string;
}

const NavBar: React.FC<NavBarProps> = ({ title = 'WizzarCallBot' }) => {
  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Título o Logo */}
          <div className="flex-shrink-0">
            <span className="text-white text-2xl font-bold tracking-wider">
              {title}
            </span>
          </div>
          
          {/* Opcional: Iconos o Elementos de Menú (ej. Perfil o Ajustes) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Ejemplo de un botón/icono (puedes reemplazar 'Button' si lo necesitas) */}
              <button 
                type="button"
                className="p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition duration-150 ease-in-out"
                aria-label="Ajustes"
                onClick={() => console.log('Abrir ajustes')}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.328.842 2.387 2.387a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.942 1.543-.842 3.328-2.387 2.387a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.328-.842-2.387-2.387a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.942-1.543.842-3.328 2.387-2.387a1.724 1.724 0 002.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;