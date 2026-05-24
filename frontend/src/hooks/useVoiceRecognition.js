import { useState, useRef, useCallback } from 'react';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const useVoiceRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [supported] = useState(!!SpeechRecognition);
  const recognitionRef = useRef(null);

  const start = useCallback(() => {
    if (!SpeechRecognition) return;
    setTranscript('');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (e) => {
      let full = '';
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript;
      }
      setTranscript(full);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setTranscript('');
  }, [stop]);

  return { transcript, listening, supported, start, stop, reset };
};

export default useVoiceRecognition;
