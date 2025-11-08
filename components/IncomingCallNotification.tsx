import React, { useEffect, useState } from 'react';
import { useVoip } from '../context/VoipContext';
import Button from './Button';

const IncomingCallNotification: React.FC = () => {
  const { incomingCall, answerCall, declineCall } = useVoip();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (incomingCall) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [incomingCall]);

  if (!incomingCall || !isVisible) {
    return null;
  }

  const handleAnswer = () => {
    answerCall(incomingCall);
    setIsVisible(false);
  };

  const handleDecline = () => {
    declineCall(incomingCall);
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center transform scale-100 animate-slide-in">
        <div className="flex items-center justify-center mb-4">
          <span className="text-5xl text-green-500">📞</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Llamada Entrante</h3>
        <p className="text-gray-700 text-lg mb-4">
          {incomingCall.name || incomingCall.number}
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={handleAnswer} variant="primary" size="lg" className="bg-green-600 hover:bg-green-700">
            Contestar
          </Button>
          <Button onClick={handleDecline} variant="danger" size="lg">
            Rechazar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
