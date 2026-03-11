
import React, { useState, useMemo } from 'react';
import { useAccessibility, LANGS } from './AccessibilityContext';

function scoreVoice(v: SpeechSynthesisVoice, langCode: string): number {
  let s = 0;
  const n = v.name.toLowerCase(), l = v.lang.toLowerCase(), lc = langCode.toLowerCase();
  if (l === lc) s += 100;
  else if (l.startsWith(lc.split('-')[0])) s += 40;
  if (n.includes('neural')) s += 60;
  if (n.includes('wavenet')) s += 55;
  if (n.includes('enhanced')) s += 50;
  if (n.includes('premium')) s += 48;
  if (n.includes('natural')) s += 30;
  if (n.includes('google')) s += 25;
  if (n.includes('microsoft')) s += 20;
  if (n.includes('siri')) s += 18;
  if (!n.includes('compact')) s += 10;
  if (v.localService) s += 5;
  return s;
}

const VoicePicker: React.FC = () => {
  const {
    voicePickerOpen, closeVoicePicker, allVoices, selectedVoiceName,
    speechRate, speechPitch, speechVol, currentLang,
    setVoiceSettings, classifyVoice,
  } = useAccessibility();

  const [pickerName, setPickerName] = useState(selectedVoiceName);
  const [rate, setRate] = useState(speechRate);
  const [pitch, setPitch] = useState(speechPitch);
  const [vol, setVol] = useState(speechVol);
  const [search, setSearch] = useState('');

  // Reset picker state when opening
  React.useEffect(() => {
    if (voicePickerOpen) {
      setPickerName(selectedVoiceName);
      setRate(speechRate);
      setPitch(speechPitch);
      setVol(speechVol);
      setSearch('');
    }
  }, [voicePickerOpen, selectedVoiceName, speechRate, speechPitch, speechVol]);

  const langCode = LANGS[currentLang]?.code || 'fil-PH';
  const baseLang = langCode.split('-')[0].toLowerCase();

  const sortedVoices = useMemo(() => {
    let v = allVoices.filter(x =>
      !search || x.name.toLowerCase().includes(search.toLowerCase()) || x.lang.toLowerCase().includes(search.toLowerCase())
    );
    return v.map(x => ({ v: x, s: scoreVoice(x, langCode) })).sort((a, b) => b.s - a.s).map(x => x.v);
  }, [allVoices, search, langCode]);

  const relevant = sortedVoices.filter(v => v.lang.toLowerCase().startsWith(baseLang));
  const others = sortedVoices.filter(v => !v.lang.toLowerCase().startsWith(baseLang)).slice(0, 40);

  const previewVoice = (name: string) => {
    window.speechSynthesis.cancel();
    const v = allVoices.find(x => x.name === name);
    if (!v) return;
    const txt = v.lang.startsWith('fil') || v.lang.startsWith('tl')
      ? 'Kumusta! Ito ang boses na iyong pinili.'
      : 'Hello! This is the voice you selected.';
    const u = new SpeechSynthesisUtterance(txt);
    u.voice = v; u.lang = v.lang;
    u.rate = rate; u.pitch = pitch; u.volume = vol;
    window.speechSynthesis.speak(u);
  };

  const apply = () => {
    setVoiceSettings(pickerName, rate, pitch, vol);
    closeVoicePicker();
  };

  if (!voicePickerOpen) return null;

  const VoiceRow: React.FC<{ v: SpeechSynthesisVoice }> = ({ v }) => {
    const cls = classifyVoice(v);
    const icon = cls === 'neural' ? '✨' : '🔈';
    return (
      <div
        onClick={() => setPickerName(v.name)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border-2 ${
          pickerName === v.name
            ? 'bg-[#8B3A2B]/10 border-[#8B3A2B]/30'
            : 'border-transparent hover:bg-gray-50'
        }`}
      >
        <div className="text-xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{v.name}</div>
          <div className="text-[10px] text-gray-500">{v.lang}{v.localService ? ' · Local' : ' · Remote'}</div>
        </div>
        <span className={`text-[10px] font-bold rounded px-2 py-0.5 border flex-shrink-0 ${
          cls === 'neural'
            ? 'text-green-700 border-green-200 bg-green-50'
            : 'text-blue-700 border-blue-200 bg-blue-50'
        }`}>
          {cls === 'neural' ? 'Neural' : 'Standard'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); previewVoice(v.name); }}
          className="border border-gray-200 text-gray-500 hover:border-[#8B3A2B] hover:text-[#8B3A2B] hover:bg-[#8B3A2B]/5 rounded-md px-2 py-1 text-[10px] transition-all flex-shrink-0"
        >
          ▶ Preview
        </button>
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[500] flex items-center justify-center p-4 transition-opacity duration-200 ${voicePickerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={(e) => { if (e.target === e.currentTarget) closeVoicePicker(); }}
    >
      <div
        className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg max-h-[82vh] flex flex-col shadow-2xl"
        style={{ animation: 'fadeUp 0.25s ease' }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <h3 className="text-base font-black">🎛️ Voice Settings</h3>
          <p className="text-xs text-gray-500 mt-0.5">Pumili ng boses · Choose a voice & adjust settings</p>
        </div>

        {/* Controls */}
        <div className="px-5 py-3 border-b border-gray-100 grid grid-cols-3 gap-4">
          <div>
            <label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Speed <span className="text-[#8B3A2B]">{rate.toFixed(2)}×</span>
            </label>
            <input type="range" min="0.5" max="1.5" step="0.05" value={rate}
              onChange={e => setRate(parseFloat(e.target.value))}
              className="w-full accent-[#8B3A2B] cursor-pointer" />
          </div>
          <div>
            <label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Pitch <span className="text-[#8B3A2B]">{pitch.toFixed(2)}</span>
            </label>
            <input type="range" min="0.5" max="1.8" step="0.05" value={pitch}
              onChange={e => setPitch(parseFloat(e.target.value))}
              className="w-full accent-[#8B3A2B] cursor-pointer" />
          </div>
          <div>
            <label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Volume <span className="text-[#8B3A2B]">{Math.round(vol * 100)}%</span>
            </label>
            <input type="range" min="0" max="1" step="0.05" value={vol}
              onChange={e => setVol(parseFloat(e.target.value))}
              className="w-full accent-[#8B3A2B] cursor-pointer" />
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-gray-100">
          <input
            type="text"
            placeholder="🔍 Search voices…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-[#8B3A2B] bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        {/* Voice list */}
        <div className="overflow-y-auto flex-1 px-3 py-2">
          {!allVoices.length && (
            <div className="text-center py-8 text-gray-500 text-sm">⚠️ No voices loaded. Open in Chrome or Edge.</div>
          )}
          {relevant.length > 0 && (
            <>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 pt-2 pb-1">
                🇵🇭 {LANGS[currentLang]?.fullName || 'Filipino'} voices
              </div>
              {relevant.map(v => <VoiceRow key={v.name} v={v} />)}
            </>
          )}
          {others.length > 0 && (
            <>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 pt-3 pb-1">🌐 Other languages</div>
              {others.map(v => <VoiceRow key={v.name} v={v} />)}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={closeVoicePicker} className="border border-gray-200 text-gray-500 hover:text-gray-700 rounded-lg px-4 py-2 text-sm font-semibold transition-all">
            Cancel
          </button>
          <button onClick={apply} className="bg-[#8B3A2B] text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-[#A54A39] transition-all shadow-md">
            ✅ Use this voice
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoicePicker;
