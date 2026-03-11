
import React, { useEffect, useRef, useState } from 'react';
import { useAccessibility, LANGS } from './AccessibilityContext';

/* ── SVG Icon Components ── */
const GearIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="3" />
    <path d="M10 1.5v2M10 16.5v2M3.7 3.7l1.4 1.4M14.9 14.9l1.4 1.4M1.5 10h2M16.5 10h2M3.7 16.3l1.4-1.4M14.9 5.1l1.4-1.4" />
  </svg>
);

const SpeakerIcon: React.FC<{ on?: boolean }> = ({ on }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {on && (
      <>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    )}
    {!on && <line x1="23" y1="9" x2="17" y2="15" />}
  </svg>
);

const MicIcon: React.FC<{ on?: boolean }> = ({ on }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
    {!on && <line x1="1" y1="1" x2="23" y2="23" />}
  </svg>
);

const SlidersIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const ChevronIcon: React.FC<{ open?: boolean }> = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Main Component ── */
const AccessibilityToolbar: React.FC = () => {
  const {
    ttsOn, voiceOn, currentLang,
    toggleTTS, toggleVoice, openVoicePicker,
    setLang,
  } = useAccessibility();

  const [open, setOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        open &&
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const langOptions = [
    { key: 'fil', flag: '🇵🇭', label: 'Filipino' },
    { key: 'en',  flag: '🇺🇸', label: 'English' },
    { key: 'ceb', flag: '🇵🇭', label: 'Cebuano' },
    { key: 'ilo', flag: '🇵🇭', label: 'Ilocano' },
  ];

  const voiceCommands = [
    ['home / simula', 'Go Home'],
    ['about / tungkol', 'About'],
    ['news / balita', 'News'],
    ['stop / tigil', 'Stop audio'],
    ['repeat / ulitin', 'Replay'],
    ['voice / boses', 'Voice picker'],
  ];

  return (
    <div className="relative">
      {/* ── Gear Button ── */}
      <button
        ref={btnRef}
        onClick={() => setOpen((prev: boolean) => !prev)}
        className={`settings-gear-btn w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
          open
            ? 'bg-white text-[#8B3A2B] border-white/40 shadow-lg'
            : 'bg-black/20 text-white/80 border-white/20 hover:bg-white/20 hover:text-white hover:border-white/40'
        }`}
        aria-label="Settings"
        title="Settings"
      >
        <GearIcon className={`transition-transform duration-500 ${open ? 'rotate-90' : ''}`} />
      </button>

      {/* ── Dropdown Panel ── */}
      <div
        ref={panelRef}
        className={`settings-dropdown absolute top-full right-0 mt-3 w-72 z-[200] transition-all duration-200 origin-top-right ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* ── Section: Language ── */}
        <div className="px-4 pt-4 pb-3">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2.5" aria-hidden="true">Language</div>
          <div className="grid grid-cols-2 gap-1.5">
            {langOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setLang(opt.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentLang === opt.key
                    ? 'bg-[#8B3A2B] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                aria-label={`Switch to ${opt.label}`}
              >
                <span className="text-sm" aria-hidden="true">{opt.flag}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100 mx-4" />

        {/* ── Section: Text-to-Speech Toggle ── */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg transition-colors ${ttsOn ? 'bg-[#8B3A2B]/10 text-[#8B3A2B]' : 'bg-gray-100 text-gray-400'}`}>
                <SpeakerIcon on={ttsOn} />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">Text-to-Speech</div>
                <div className="text-[10px] text-gray-400">{ttsOn ? 'Active' : 'Tap to enable'}</div>
              </div>
            </div>
            <button
              onClick={toggleTTS}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                ttsOn ? 'bg-[#8B3A2B]' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={ttsOn}
              aria-label="Toggle text to speech"
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                ttsOn ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* ── Section: TTS Configuration (only when TTS is ON) ── */}
        {ttsOn && (
          <>
            <div className="h-px bg-gray-100 mx-4" />
            <div className="px-4 py-3 space-y-2" style={{ animation: 'settingsSlideIn 0.25s ease' }}>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1" aria-hidden="true">TTS Configuration</div>

              {/* Voice Commands Toggle */}
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${voiceOn ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
                    <MicIcon on={voiceOn} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">Voice Commands</div>
                    <div className="text-[10px] text-gray-400">{voiceOn ? 'Listening…' : 'Off'}</div>
                  </div>
                </div>
                <button
                  onClick={toggleVoice}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                    voiceOn ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={voiceOn}
                  aria-label="Toggle voice commands"
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    voiceOn ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Voice Settings Button */}
              <button
                onClick={() => { openVoicePicker(); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-[#8B3A2B]/5 hover:border-[#8B3A2B]/20 border border-gray-100 text-xs font-semibold text-gray-600 hover:text-[#8B3A2B] transition-all group"
              >
                <SlidersIcon />
                <span className="flex-1 text-left">Voice &amp; Speed Settings</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-gray-300 group-hover:text-[#8B3A2B] transition-colors">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Collapsible Voice Commands List */}
              {voiceOn && (
                <div>
                  <button
                    onClick={() => setCmdOpen((prev: boolean) => !prev)}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors mt-1 mb-1"
                  >
                    <ChevronIcon open={cmdOpen} />
                    Voice Command Reference
                  </button>
                  {cmdOpen && (
                    <div className="space-y-1 mt-1" style={{ animation: 'settingsSlideIn 0.2s ease' }}>
                      {voiceCommands.map(([cmd, desc]) => (
                        <div key={cmd} className="flex items-center gap-2 text-[11px]">
                          <code className="bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] text-[#8B3A2B] font-mono flex-shrink-0">{cmd}</code>
                          <span className="text-gray-400">{desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccessibilityToolbar;
