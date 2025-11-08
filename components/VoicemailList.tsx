import React, { useState } from 'react';
import { useVoip } from '../context/VoipContext';
import { Voicemail, AISpeechPurpose } from '../types';
import Button from './Button';
import { speak } from '../services/speechService'; // Direct import for playing transcription

const VoicemailList: React.FC = () => {
  const { voicemails, markVoicemailAsRead, deleteVoicemail } = useVoip();
  const [playingVoicemailId, setPlayingVoicemailId] = useState<string | null>(null);

  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayVoicemail = async (voicemail: Voicemail) => {
    if (playingVoicemailId === voicemail.id) {
      // If already playing, stop it
      setPlayingVoicemailId(null);
      // Actual audio stop functionality would be needed here if playing real audio
    } else {
      setPlayingVoicemailId(voicemail.id);
      markVoicemailAsRead(voicemail.id);
      // Simulate playing the audio by reading the transcription
      await speak(voicemail.transcription, AISpeechPurpose.NOTIFICATION);
      setPlayingVoicemailId(null); // Reset after "playing"
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Buzón de Voz</h2>
      {voicemails.length === 0 ? (
        <p className="text-gray-500">No hay mensajes de voz.</p>
      ) : (
        <ul>
          {voicemails.map((vm: Voicemail) => (
            <li key={vm.id} className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150 ${!vm.isRead ? 'bg-blue-50/70' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">
                    {vm.senderName || vm.senderNumber} {!vm.isRead && <span className="text-blue-600 text-xs">(Nuevo)</span>}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTimestamp(vm.timestamp)} &bull; {formatDuration(vm.duration)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handlePlayVoicemail(vm)}
                    size="sm"
                    variant="secondary"
                    className="px-2 py-1 text-sm"
                  >
                    {playingVoicemailId === vm.id ? '⏸️ Detener' : '▶️ Reproducir'}
                  </Button>
                  <Button
                    onClick={() => deleteVoicemail(vm.id)}
                    size="sm"
                    variant="danger"
                    className="px-2 py-1 text-sm"
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-gray-700 text-sm bg-gray-50 p-2 rounded-md">
                <p className="font-medium text-gray-600 mb-1">Transcripción:</p>
                <p>{vm.transcription}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VoicemailList;
