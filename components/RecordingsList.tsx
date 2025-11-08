// ./components/RecordingsList.tsx
import React from 'react';

const RecordingsList: React.FC = () => {
  // Aquí iría la lógica para listar las grabaciones
  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">🎧 Grabaciones de Llamadas</h2>
      <p className="text-gray-600">Aquí se mostrará la lista de grabaciones disponibles.</p>
      {/* Ejemplo de un elemento de lista */}
      <div className="mt-4 p-3 border-b">
        <p className="font-semibold">Grabación del 2025-11-08</p>
        <p className="text-sm text-gray-500">Duración: 5:30</p>
        {/* <Button>Reproducir</Button> */}
      </div>
    </div>
  );
};

export default RecordingsList;