import React from 'react';
import { useVoip } from '../context/VoipContext';
import { Call, CallType } from '../types';
import Button from './Button';

const CallHistory: React.FC = () => {
  const { callHistory, startCall } = useVoip();

  const getCallIcon = (type: CallType) => {
    switch (type) {
      case CallType.INCOMING:
        return <span className="text-green-500 mr-2">⬇️</span>;
      case CallType.OUTGOING:
        return <span className="text-blue-500 mr-2">⬆️</span>;
      case CallType.MISSED:
        return <span className="text-red-500 mr-2">🚫</span>;
      default:
        return null;
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (seconds === undefined) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Adjust as needed for specific locale/format
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Historial de Llamadas</h2>
      {callHistory.length === 0 ? (
        <p className="text-gray-500">No hay llamadas en el historial.</p>
      ) : (
        <ul>
          {callHistory.map((call: Call) => (
            <li key={call.id} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center flex-grow">
                {getCallIcon(call.type)}
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{call.name || call.number}</p>
                  <p className="text-sm text-gray-500">
                    {formatTimestamp(call.timestamp)}
                    {call.duration !== undefined && (
                      <span className="ml-2">({formatDuration(call.duration)})</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Button
                  onClick={() => startCall(call.number)}
                  size="sm"
                  variant="primary"
                  className="px-2 py-1 text-sm"
                >
                  Devolver llamada
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CallHistory;
