import React, { useEffect, useState } from 'react';
import { Mic, MicOff, CheckCircle, X, RefreshCw } from 'lucide-react';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import { parseSpeech } from '../utils/speechParser';

const FIELD_LABELS = {
  name: 'Drug Name',
  category: 'Category',
  quantity: 'Quantity',
  unit: 'Unit',
  price: 'Price',
  expiryDate: 'Expiry Date',
};

const VoiceInputModal = ({ onApply, onClose }) => {
  const { transcript, listening, supported, start, stop, reset } = useVoiceRecognition();
  const [parsed, setParsed] = useState({});
  const [phase, setPhase] = useState('idle'); // idle | listening | review

  useEffect(() => {
    if (!listening && transcript) {
      const result = parseSpeech(transcript);
      setParsed(result);
      setPhase('review');
    }
  }, [listening, transcript]);

  const handleStart = () => {
    reset();
    setParsed({});
    setPhase('listening');
    start();
  };

  const handleStop = () => {
    stop();
  };

  const handleApply = () => {
    onApply(parsed);
    onClose();
  };

  const handleRetry = () => {
    reset();
    setParsed({});
    setPhase('idle');
  };

  if (!supported) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          <MicOff size={40} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Not Supported</h3>
          <p className="text-sm text-gray-500 mb-4">
            Voice recognition requires Chrome or Edge browser.
          </p>
          <button onClick={onClose} className="btn-primary w-full justify-center">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#121358' }}>
          <div className="flex items-center gap-2 text-white">
            <Mic size={18} />
            <span className="font-bold text-sm">Voice Input</span>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Idle state */}
          {phase === 'idle' && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Speak the drug details naturally. For example:<br />
                <span className="italic text-gray-400">
                  "Paracetamol 500mg, analgesic, 100 tablets, price 2.50, expires December 2026"
                </span>
              </p>
              <button
                onClick={handleStart}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#121358' }}
              >
                <Mic size={32} className="text-white" />
              </button>
              <p className="text-xs text-gray-400 mt-4">Tap to start speaking</p>
            </div>
          )}

          {/* Listening state */}
          {phase === 'listening' && (
            <div className="text-center py-4">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <span className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none" style={{ backgroundColor: '#121358' }} />
                <span className="absolute inset-2 rounded-full animate-ping opacity-20 pointer-events-none" style={{ backgroundColor: '#121358' }} />
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: '#121358' }}
                >
                  <Mic size={32} className="text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Listening...</p>
              {transcript && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 italic text-left border border-gray-200 mb-4 max-h-24 overflow-y-auto">
                  "{transcript}"
                </div>
              )}
              <button
                onClick={handleStop}
                className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#c0392b' }}
              >
                <MicOff size={16} /> Stop Recording
              </button>
            </div>
          )}

          {/* Review state */}
          {phase === 'review' && (
            <div>
              <p className="text-sm text-gray-500 mb-1 italic text-center">"{transcript}"</p>
              <p className="text-xs text-gray-400 text-center mb-4">Fields detected from your speech:</p>

              {Object.keys(parsed).length === 0 ? (
                <div className="text-center py-4 text-gray-400">
                  <p className="text-sm">Couldn't detect any fields. Try again.</p>
                </div>
              ) : (
                <div className="space-y-2 mb-5">
                  {Object.entries(parsed).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between bg-primary-50 rounded-lg px-3 py-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {FIELD_LABELS[key] || key}
                      </span>
                      <span className="text-sm font-bold text-primary">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                {Object.keys(parsed).length > 0 && (
                  <button onClick={handleApply} className="btn-primary flex-1 justify-center">
                    <CheckCircle size={16} /> Apply to Form
                  </button>
                )}
                <button onClick={handleRetry} className="btn-secondary flex-1 justify-center">
                  <RefreshCw size={16} /> Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInputModal;
