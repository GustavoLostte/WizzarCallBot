// ./components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white p-3 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center text-sm">
        <p>
          &copy; {currentYear} WizzarCallBot. Desarrollado con ❤️ y React.
        </p>
      </div>
    </footer>
  );
};

export default Footer;