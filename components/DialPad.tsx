import React, { useEffect } from 'react'; // Importamos useEffect
import Button from './Button';
import { useVoip } from '../context/VoipContext';

const DialPad: React.FC = () => {
  const { dialedNumber, setDialedNumber, startCall, activeCall } = useVoip();

  const handleKeyPress = (key: string) => {
    setDialedNumber((prev) => prev + key);
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialedNumber && !activeCall) {
      startCall(dialedNumber);
    }
  };

  const handleAddContact = () => {
    console.log(`Intentando agregar el número: ${dialedNumber} como contacto.`);
    alert(`Funcionalidad 'Agregar Contacto' para ${dialedNumber} aún no implementada.`);
  };

  const dialPadKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  // --- 🌟 Nuevo: Hook useEffect para manejar el teclado físico 🌟 ---
  useEffect(() => {
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'];

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (validKeys.includes(key)) {
        // Si es una tecla numérica o especial válida, la agregamos
        handleKeyPress(key);
      } else if (key === 'Backspace') {
        // Si es la tecla de borrar
        handleBackspace();
      } else if (key === 'Enter') {
        // Si es la tecla Enter, simulamos una llamada
        handleCall();
      }
      
      // Opcional: prevenir el comportamiento por defecto (ej. desplazarse con la barra espaciadora)
      if (validKeys.includes(key) || key === 'Backspace' || key === 'Enter') {
        event.preventDefault();
      }
    };

    // Agregar el escuchador de eventos al documento
    document.addEventListener('keydown', handleKeyDown);

    // Función de limpieza: Se ejecuta al desmontar el componente para evitar fugas de memoria
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress, handleBackspace, handleCall]); // Dependencias para que se reactive si las funciones cambian

  // ----------------------------------------------------------------------
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
      <div className="w-full mb-4">
        <input
          type="text"
          className="w-full p-3 text-2xl text-center border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200"
          value={dialedNumber}
          readOnly
          placeholder="Enter number"
        />
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {dialPadKeys.flat().map((key) => (
          <Button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="w-full aspect-square text-2xl"
            variant="secondary"
            size="lg"
          >
            {key}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-3"> 
        <Button
          onClick={handleBackspace}
          className="w-full aspect-square text-2xl"
          variant="secondary"
          size="lg"
          disabled={dialedNumber.length === 0}
        >
          &larr;
        </Button>

        <Button
          onClick={handleAddContact}
          className="w-full aspect-square text-2xl" 
          variant="secondary"
          size="lg"
          disabled={!dialedNumber}
        >
          +
        </Button>
        
        <Button
          onClick={handleCall}
          className="w-full aspect-square text-2xl bg-green-500 hover:bg-green-600 text-white"
          size="lg"
          disabled={!dialedNumber || activeCall !== null}
        >
          📞
        </Button>
      </div>
    </div>
  );
};

export default DialPad;