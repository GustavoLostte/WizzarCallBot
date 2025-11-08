// ./components/TranscriptionsList.tsx
import React from 'react';

const TranscriptionsList: React.FC = () => {
  // Aquí iría la lógica para mostrar las transcripciones
  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">📝 Transcripciones</h2>
      <p className="text-gray-600">Aquí se mostrará la lista de transcripciones de voz y llamadas.</p>
      {/* Ejemplo de un elemento de lista */}
      <div className="mt-4 p-3 border-b">
        <p className="font-semibold">Transcripción de Mensaje de Voz</p>
        <p className="text-sm text-gray-500 italic">"Hola, llámame cuando puedas..."</p>
      </div>
    </div>
  );
};

export default TranscriptionsList;