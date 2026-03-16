
import React, { useState, useEffect } from 'react';
import { useAccessibility, LANGS } from './AccessibilityContext';

const AccessibilityOnboarding: React.FC = () => {
  const { hasOnboarded, finishOnboarding, speakRaw } = useAccessibility();
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState('');
  const [ttsChoice, setTtsChoice] = useState(false);

  if (hasOnboarded) return null;

  const handleStart = () => {
    const welcomeEn = "Welcome to BRIX: Building Reporting and Infrastructure Exchange. Please click on a project with the photo to view details. Turn this voice on or off with the button on the top right. Do you want to turn on the voice and keep it open?";
    const welcomeFil = "Mabuhay, ito ay BRIX: Building Reporting and Infrastructure Exchange. I-click ang isang proyekto na may imahe para makita ang detalye. Maaari mong i-on o i-off ang boses gamit ang button sa kanang itaas. Gusto mo bang i-on ang boses at panatilihin itong bukas?";
    
    // Play both languages
    speakRaw(`${welcomeFil} ${welcomeEn}`, 'fil-PH');
    setStep(1);
  };

  const handleTTS = (val: boolean) => {
    setTtsChoice(val);
    setStep(2);
    speakRaw('Piliin ang iyong wika.', 'fil-PH');
  };

  const handleLangSelect = (lang: string) => {
    setSelectedLang(lang);
    speakRaw('Pinili mo ang ' + LANGS[lang].spokenName, 'fil-PH');
  };

  const handleFinish = () => {
    if (!selectedLang) return;
    finishOnboarding(ttsChoice, selectedLang);
  };

  const langOptions = [
    { key: 'fil', flag: '🇵🇭', label: 'Filipino' },
    { key: 'en',  flag: '🇺🇸', label: 'English' },
    { key: 'ceb', flag: '🇵🇭', label: 'Cebuano' },
    { key: 'ilo', flag: '🇵🇭', label: 'Ilocano' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F8F9FA] flex flex-col items-center justify-center p-6" style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* BRIX Logo */}
      <div className="mb-1">
        <span className="bg-[#8B3A2B] text-white px-4 py-1 rounded-sm font-black text-3xl tracking-tighter transform inline-block" style={{ transform: 'skewX(-12deg)' }}>BRIX</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B3A2B]/50 mb-8">Building Reports & Infrastructure Exchange</p>

      {/* Card */}
      <div className="border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-xl bg-white text-center" style={{ animation: step !== 0 ? 'fadeUp 0.35s ease' : undefined }}>
        {step === 0 && (
          <div style={{ animation: 'fadeUp 0.35s ease' }}>
            <span className="text-5xl mb-4 block">👋</span>
            <h2 className="text-xl font-black text-[#1A1A1A] mb-1">Mabuhay! Welcome!</h2>
            <p className="text-sm text-gray-500 mb-8">
              Click start to begin the brix experience.<br/>
              I-click ang simula para mag-umpisa.
            </p>
            <button
              onClick={handleStart}
              className="w-full bg-[#8B3A2B] text-white py-4 rounded-xl font-black text-lg hover:bg-[#A54A39] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              Magsimula / Start →
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: 'fadeUp 0.35s ease' }}>
            <span className="text-5xl mb-4 block">🔊</span>
            <h2 className="text-xl font-black text-[#1A1A1A] mb-1">Gusto mo bang i-on ang boses at panatilihin itong bukas?</h2>
            <p className="text-sm text-gray-500 mb-6">Do you want to turn on the voice and keep it open?</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => handleTTS(true)}
                className="bg-[#8B3A2B] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#A54A39] transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                ✅ Oo / Yes
              </button>
              <button
                onClick={() => handleTTS(false)}
                className="bg-white text-[#1A1A1A] px-6 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 hover:border-[#8B3A2B] hover:bg-[#8B3A2B]/5 transition-all active:scale-95 flex items-center gap-2"
              >
                ❌ Hindi / No
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeUp 0.35s ease' }}>
            <span className="text-5xl mb-4 block">🌐</span>
            <h2 className="text-xl font-black text-[#1A1A1A] mb-1">Piliin ang iyong wika</h2>
            <p className="text-sm text-gray-500 mb-6">Choose your preferred language</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {langOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleLangSelect(opt.key)}
                  className={`border-2 rounded-xl py-3 px-2 font-bold text-sm cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    selectedLang === opt.key
                      ? 'border-[#8B3A2B] bg-[#8B3A2B]/10 text-[#8B3A2B]'
                      : 'border-gray-200 bg-white text-[#1A1A1A] hover:border-[#8B3A2B]/50'
                  }`}
                >
                  <span className="text-2xl">{opt.flag}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleFinish}
              disabled={!selectedLang}
              className={`w-full py-3 rounded-xl font-black text-sm transition-all shadow-lg ${
                selectedLang
                  ? 'bg-[#8B3A2B] text-white hover:bg-[#A54A39] active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Magpatuloy → Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityOnboarding;
