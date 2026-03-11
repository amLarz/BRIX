
import React from 'react';
import { useAccessibility } from './AccessibilityContext';

const TTSBar: React.FC = () => {
  const { isSpeaking, speakingSnippet, stopTTS } = useAccessibility();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 z-[300] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
        isSpeaking ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Waveform */}
      <div className="flex items-center gap-[2px] flex-shrink-0">
        {[7, 14, 10, 18, 9].map((h, i) => (
          <b
            key={i}
            className="block w-[3px] rounded-sm bg-[#8B3A2B]"
            style={{
              height: `${h}px`,
              animation: 'accWave 1s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <div className="flex-1 text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
        Nagbabasa: <strong className="text-[#1A1A1A] font-semibold">{speakingSnippet}</strong>
      </div>

      {/* Stop */}
      <button
        onClick={stopTTS}
        className="bg-red-100 border border-red-300 text-red-600 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-red-200 transition-all flex-shrink-0"
      >
        ■ Stop
      </button>
    </div>
  );
};

export default TTSBar;
