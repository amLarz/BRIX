
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

/* ══════════════════════════════════════
   LANGUAGE CONFIG
══════════════════════════════════════ */
export const LANGS: Record<string, { code: string; badge: string; fullName: string; spokenName: string; googleCode: string }> = {
  fil: { code: 'fil-PH', badge: 'PH', fullName: 'Filipino', spokenName: 'Filipino', googleCode: 'tl' },
  en:  { code: 'en-US',  badge: 'EN', fullName: 'English',  spokenName: 'English', googleCode: 'en'  },
  ceb: { code: 'fil-PH', badge: 'CB', fullName: 'Cebuano',  spokenName: 'Cebuano', googleCode: 'ceb' },
  ilo: { code: 'fil-PH', badge: 'IL', fullName: 'Ilocano',  spokenName: 'Ilocano', googleCode: 'ilo' },
};

/* ══════════════════════════════════════
   CONTEXT TYPES
══════════════════════════════════════ */
interface AccessibilityState {
  ttsOn: boolean;
  voiceOn: boolean;
  currentLang: string;
  fontLevel: number;
  hasOnboarded: boolean;
  isSpeaking: boolean;
  speakingSnippet: string;
  toastMessage: string;
  showToast: boolean;
  allVoices: SpeechSynthesisVoice[];
  selectedVoiceName: string;
  speechRate: number;
  speechPitch: number;
  speechVol: number;
  voicePanelOpen: boolean;
  voicePickerOpen: boolean;
  langDropOpen: boolean;
}

interface AccessibilityActions {
  toggleTTS: () => void;
  toggleVoice: () => void;
  setLang: (lang: string) => void;
  cycleFont: () => void;
  finishOnboarding: (tts: boolean, lang: string) => void;
  speak: (text: string, lang?: string) => void;
  speakRaw: (text: string, langCode?: string) => void;
  stopTTS: () => void;
  openVoicePicker: () => void;
  closeVoicePicker: () => void;
  setVoiceSettings: (name: string, rate: number, pitch: number, vol: number) => void;
  showToastMsg: (msg: string) => void;
  toggleLangDrop: () => void;
  closeLangDrop: () => void;
  toggleVoicePanel: () => void;
  getBestVoice: (langCode: string) => SpeechSynthesisVoice | null;
  classifyVoice: (v: SpeechSynthesisVoice | null) => string;
  getVoiceObj: () => SpeechSynthesisVoice | null;
}

type AccessibilityContextType = AccessibilityState & AccessibilityActions;

const AccessibilityCtx = createContext<AccessibilityContextType | null>(null);

export function useAccessibility() {
  const ctx = useContext(AccessibilityCtx);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}

/* ══════════════════════════════════════
   VOICE SCORING ENGINE
══════════════════════════════════════ */
function scoreVoice(v: SpeechSynthesisVoice, langCode: string): number {
  let s = 0;
  const n = v.name.toLowerCase(),
        l = v.lang.toLowerCase(),
        lc = langCode.toLowerCase();
  if (l === lc) s += 100;
  else if (l.startsWith(lc.split('-')[0])) s += 40;
  if (n.includes('neural'))    s += 60;
  if (n.includes('wavenet'))   s += 55;
  if (n.includes('enhanced'))  s += 50;
  if (n.includes('premium'))   s += 48;
  if (n.includes('natural'))   s += 30;
  if (n.includes('google'))    s += 25;
  if (n.includes('microsoft')) s += 20;
  if (n.includes('siri'))      s += 18;
  if (!n.includes('compact'))  s += 10;
  if (v.localService)          s += 5;
  return s;
}

/* ══════════════════════════════════════
   PROVIDER
══════════════════════════════════════ */
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ttsOn, setTtsOn] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [currentLang, setCurrentLang] = useState('fil');
  const [fontLevel, setFontLevel] = useState(0);
  const [hasOnboarded, setHasOnboarded] = useState(() => !!localStorage.getItem('brix_onboarded'));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSnippet, setSpeakingSnippet] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState(() => localStorage.getItem('acc_voice') || '');
  const [speechRate, setSpeechRate] = useState(() => parseFloat(localStorage.getItem('acc_rate') || '0.9'));
  const [speechPitch, setSpeechPitch] = useState(() => parseFloat(localStorage.getItem('acc_pitch') || '1.0'));
  const [speechVol, setSpeechVol] = useState(() => parseFloat(localStorage.getItem('acc_vol') || '1.0'));
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [voicePickerOpen, setVoicePickerOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSpokenRef = useRef<string>('');
  const lastSpokenLangRef = useRef<string>('fil');

  // ── Load voices ──
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setAllVoices(v);
    };
    window.speechSynthesis.onvoiceschanged = load;
    load();
    setTimeout(load, 400);
  }, []);

  // ── Auto-pick best voice on first load ──
  useEffect(() => {
    if (allVoices.length && !selectedVoiceName) {
      const best = getBestVoiceInternal(allVoices, LANGS[currentLang]?.code || 'fil-PH');
      if (best) setSelectedVoiceName(best.name);
    }
  }, [allVoices]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Initialize Google Translate ──
  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
        );
      };
    }

    // Add hidden div for translate element
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }
  }, []);

  // ── Google Translate Language Sync ──
  const syncGoogleTranslate = useCallback((langKey: string) => {
    const googleCode = LANGS[langKey]?.googleCode || 'en';
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    // Set cookie as fallback
    document.cookie = `googtrans=/en/${googleCode}; path=/; domain=${window.location.hostname}; SameSite=Lax`;
    document.cookie = `googtrans=/en/${googleCode}; path=/; SameSite=Lax`;
    
    if (select) {
      select.value = googleCode;
      select.dispatchEvent(new Event('change'));
    } else {
      // If widget hasn't loaded yet, try again shortly
      setTimeout(() => {
        const retrySelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (retrySelect) {
          retrySelect.value = googleCode;
          retrySelect.dispatchEvent(new Event('change'));
        } else {
          // Force reload only if totally necessary and cookie is set
          // window.location.reload(); 
        }
      }, 1000);
    }
  }, []);

  // ── Font classes ──
  useEffect(() => {
    document.body.classList.remove('font-lg', 'font-xl');
    if (fontLevel === 1) document.body.classList.add('font-lg');
    if (fontLevel === 2) document.body.classList.add('font-xl');
  }, [fontLevel]);

 
  // ── Helper Functions ──
  function getBestVoiceInternal(voices: SpeechSynthesisVoice[], langCode: string) {
    const scored = voices
      .map(v => ({ v, s: scoreVoice(v, langCode) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s);
    return scored.length ? scored[0].v : (voices[0] || null);
  }

  const getBestVoice = useCallback((langCode: string) => {
    return getBestVoiceInternal(allVoices, langCode);
  }, [allVoices]);

  const getVoiceObj = useCallback(() => {
    if (selectedVoiceName) {
      const f = allVoices.find(v => v.name === selectedVoiceName);
      if (f) return f;
    }
    return getBestVoiceInternal(allVoices, LANGS[currentLang]?.code || 'fil-PH');
  }, [allVoices, selectedVoiceName, currentLang]);

  const classifyVoice = useCallback((v: SpeechSynthesisVoice | null) => {
    if (!v) return 'none';
    const n = v.name.toLowerCase();
    if (n.includes('neural') || n.includes('wavenet') || n.includes('enhanced') || n.includes('premium')) return 'neural';
    return 'standard';
  }, []);

  // ── Speak (content) ──
  const speak = useCallback((text: string, lang?: string) => {
    const l = lang || currentLang;
    lastSpokenRef.current = text;
    lastSpokenLangRef.current = l;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANGS[l]?.code || 'fil-PH';
    u.rate = speechRate;
    u.pitch = speechPitch;
    u.volume = speechVol;
    const v = getVoiceObj();
    if (v) u.voice = v;
    setIsSpeaking(true);
    setSpeakingSnippet(text.length > 55 ? text.slice(0, 55) + '…' : text);
    u.onend = () => { setIsSpeaking(false); };
    window.speechSynthesis.speak(u);
  }, [currentLang, speechRate, speechPitch, speechVol, getVoiceObj]);

  // ── SpeakRaw (UI feedback / onboarding) ──
  const speakRaw = useCallback((text: string, langCode?: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode || 'fil-PH';
    u.rate = speechRate;
    u.pitch = speechPitch;
    u.volume = speechVol;
    const v = getBestVoiceInternal(allVoices, langCode || 'fil-PH');
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }, [allVoices, speechRate, speechPitch, speechVol]);

  const stopTTS = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingSnippet('');
  }, []);

  const showToastMsg = useCallback((msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 2600);
  }, []);

  // ── TTS Global Click-to-Read & Selection-to-Read ──
  useEffect(() => {
    if (!ttsOn) return;

    const handleMouseUp = () => {
      const selected = window.getSelection()?.toString().trim();
      if (selected && selected.length > 0) {
        speak(selected, currentLang);
        return;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Don't interfere if they are actively selecting text
      if (window.getSelection()?.toString().trim()) return;

      const target = e.target as HTMLElement;
      
      // Specifically target readable blocks, skip our own interactive elements unless desired
      const readableTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'SPAN', 'DIV', 'A', 'STRONG', 'B'];
      
      // Prevent reading if clicking the accessibility tools themselves
      if (target.closest('.settings-dropdown') || target.closest('.settings-gear-btn') || target.closest('.fixed.bottom-0')) {
        return;
      }

      // EXCLUDE ALL BUTTONS AND ELEMENTS MARKED WITH NO-TTS
      if (target.closest('button') || target.closest('.no-tts')) {
        return;
      }

      // Find closest textual element if clicking inside one
      let readTarget: HTMLElement | null = target;
      while (readTarget && readTarget !== document.body) {
        if (readableTags.includes(readTarget.tagName)) {
           // Basic check to see if it actually has direct text, not just children
           const text = readTarget.textContent?.trim();
           // Heuristic: If it has text and isn't purely a massive container, speak it.
           // A better dynamic approach is reading innerText if available and reasonable length.
           if (text && text.length > 0) {
               speak(text, currentLang);
               e.stopPropagation(); // Prevent reading parent containers too
               return;
           }
        }
        readTarget = readTarget.parentElement;
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [ttsOn, currentLang, speak]);

  // ── Voice navigation ──
  const startRec = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = currentLang === 'en' ? 'en-US' : 'fil-PH';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onstart = () => showToastMsg('🎤 Nakikinig…');
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) handleCmd(e.results[i][0].transcript.trim().toLowerCase());
        else interim += e.results[i][0].transcript;
      }
      if (interim) showToastMsg('"' + interim + '"');
    };
    rec.onerror = (e: any) => { if (e.error !== 'no-speech') showToastMsg('Error: ' + e.error); };
    rec.onend = () => {
      if (voiceOn) setTimeout(() => { try { rec.start(); } catch (_) {} }, 300);
    };
    rec.start();
    recognitionRef.current = rec;
  }, [currentLang, showToastMsg, voiceOn]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopRec = useCallback(() => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (_) {} }
    setShowToast(false);
  }, []);

  const handleCmd = useCallback((cmd: string) => {
    showToastMsg('→ "' + cmd + '"');
    const SECS: Record<string, string> = {
      home: '#nav-home', simula: '#nav-home', start: '#nav-home',
      about: '#nav-about', tungkol: '#nav-about',
      news: '#nav-news', balita: '#nav-news',
    };
    for (const [kw, sel] of Object.entries(SECS)) {
      if (cmd.includes(kw)) {
        const el = document.querySelector(sel) as HTMLElement;
        if (el) {
          el.click();
          speak('Pumunta sa ' + kw, currentLang);
        }
        return;
      }
    }
    if (cmd.includes('stop') || cmd.includes('tigil')) { stopTTS(); return; }
    if (cmd.includes('repeat') || cmd.includes('ulitin')) {
      if (lastSpokenRef.current) speak(lastSpokenRef.current, lastSpokenLangRef.current);
      return;
    }
    if (cmd.includes('bigger') || cmd.includes('malaki')) { cycleFont(); return; }
    if (cmd.includes('voice') || cmd.includes('boses')) { setVoicePickerOpen(true); return; }
  }, [showToastMsg, speak, currentLang, stopTTS]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ──
  const toggleTTS = useCallback(() => {
    const next = !ttsOn;
    setTtsOn(next);
    document.body.classList.toggle('tts-on', next);
    if (next) {
      speak('Text to speech naka-on. I-click ang kahit anong kahon para marinig ito.', currentLang);
    } else {
      stopTTS();
      speakRaw('Text to speech naka-off.', LANGS[currentLang].code);
    }
  }, [ttsOn, speak, stopTTS, speakRaw, currentLang]);

  const toggleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToastMsg('⚠️ Voice needs Chrome/Edge');
      return;
    }
    const next = !voiceOn;
    setVoiceOn(next);
    setVoicePanelOpen(next);
    if (next) {
      startRec();
      speak('Voice navigation naka-on. Sabihin ang iyong utos.', currentLang);
    } else {
      stopRec();
      speak('Voice navigation naka-off.', currentLang);
    }
  }, [voiceOn, startRec, stopRec, speak, currentLang, showToastMsg]);

  const setLang = useCallback((l: string) => {
    setCurrentLang(l);
    localStorage.setItem('brix_lang', l);
    syncGoogleTranslate(l);
    setLangDropOpen(false);
    if (!localStorage.getItem('acc_voice')) {
      setSelectedVoiceName('');
      const best = getBestVoiceInternal(allVoices, LANGS[l]?.code || 'fil-PH');
      if (best) setSelectedVoiceName(best.name);
    }
    if (ttsOn) {
      speak('Wika ay ' + LANGS[l].spokenName, l);
    }
    if (voiceOn) {
      stopRec();
      setTimeout(startRec, 400);
    }
  }, [allVoices, speak, ttsOn, voiceOn, stopRec, startRec, syncGoogleTranslate]);

  const cycleFont = useCallback(() => {
    setFontLevel(prev => {
      const next = (prev + 1) % 3;
      showToastMsg('Font: ' + ['Normal', 'Large', 'Extra Large'][next]);
      return next;
    });
  }, [showToastMsg]);

  const finishOnboarding = useCallback((tts: boolean, lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('brix_lang', lang);
    syncGoogleTranslate(lang);
    setTtsOn(tts);
    if (tts) document.body.classList.add('tts-on');
    const best = getBestVoiceInternal(allVoices, LANGS[lang]?.code || 'fil-PH');
    if (best) setSelectedVoiceName(best.name);
    setHasOnboarded(true);
    localStorage.setItem('brix_onboarded', '1');
    window.speechSynthesis.cancel();
    setTimeout(() => {
      if (tts) speak('Naka-on na ang text to speech. I-click ang kahit anong kahon para marinig ito.', lang);
      else speakRaw('Maligayang pagdating.', LANGS[lang]?.code || 'fil-PH');
    }, 600);
  }, [allVoices, speak, speakRaw, syncGoogleTranslate]);

  const openVoicePicker = useCallback(() => setVoicePickerOpen(true), []);
  const closeVoicePicker = useCallback(() => setVoicePickerOpen(false), []);
  const toggleLangDrop = useCallback(() => setLangDropOpen(prev => !prev), []);
  const closeLangDrop = useCallback(() => setLangDropOpen(false), []);
  const toggleVoicePanel = useCallback(() => setVoicePanelOpen(prev => !prev), []);

  const setVoiceSettings = useCallback((name: string, rate: number, pitch: number, vol: number) => {
    setSelectedVoiceName(name);
    setSpeechRate(rate);
    setSpeechPitch(pitch);
    setSpeechVol(vol);
    localStorage.setItem('acc_voice', name);
    localStorage.setItem('acc_rate', String(rate));
    localStorage.setItem('acc_pitch', String(pitch));
    localStorage.setItem('acc_vol', String(vol));
    showToastMsg('✅ Voice saved!');
    speak('Napili mo na ang bagong boses.', currentLang);
  }, [showToastMsg, speak, currentLang]);

  const value: AccessibilityContextType = {
    ttsOn, voiceOn, currentLang, fontLevel, hasOnboarded,
    isSpeaking, speakingSnippet, toastMessage, showToast,
    allVoices, selectedVoiceName, speechRate, speechPitch, speechVol,
    voicePanelOpen, voicePickerOpen, langDropOpen,
    toggleTTS, toggleVoice, setLang, cycleFont, finishOnboarding,
    speak, speakRaw, stopTTS, openVoicePicker, closeVoicePicker,
    setVoiceSettings, showToastMsg, toggleLangDrop, closeLangDrop,
    toggleVoicePanel, getBestVoice, classifyVoice, getVoiceObj,
  };

  return <AccessibilityCtx.Provider value={value}>{children}</AccessibilityCtx.Provider>;
};
