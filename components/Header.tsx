
import React from 'react';
import AccessibilityToolbar from './AccessibilityToolbar';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onHomeClick: () => void;
  onAddClick: () => void;
  onAboutClick: () => void;
  onNewsClick: () => void;
  showSearch?: boolean;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onHomeClick, 
  onAddClick,
  onAboutClick,
  onNewsClick,
  showSearch = true,
  isAdmin
}) => {
  return (
    <header className="relative w-full z-[250]">
      {/* Top Banner */}
      <div className="bg-[#8B3A2B] z-30 text-white p-5 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center relative shadow-2xl">
        <div className="z-10 group cursor-pointer select-none no-tts" onClick={onHomeClick}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#8B3A2B] px-4 py-1 rounded-sm font-black text-4xl lg:text-6xl tracking-tighter transform -skew-x-12 shadow-lg group-hover:scale-105 transition-transform">
                BRIX
              </div>
              <div className="h-12 w-0.5 bg-white/20 hidden lg:block" />
              <div className="max-w-md">
                <h2 className="text-xs lg:text-sm font-black uppercase tracking-[0.15em] leading-tight text-white opacity-90">
                  BUILDING REPORTS & INFRASTRUCTURE EXCHANGE
                </h2>
              </div>
            </div>
            <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] mt-3 text-white/50 group-hover:text-white/80 transition-colors">
              Building trust brick by Brix.
            </p>
          </div>
        </div>
        
        {/* Sleek Ergonomic Navigation Section */}
        <div className="z-10 mt-6 lg:mt-0 flex flex-wrap items-center gap-4">
           <button 
             onClick={onNewsClick}
             className="relative overflow-hidden px-8 py-2.5 rounded-full bg-[#8B3A2B] hover:bg-white hover:text-[#8B3A2B] border border-white/30 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl backdrop-blur-sm group/btn flex items-center gap-2"
           >
             <span className="relative z-10 flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
               </svg>
               Infrastructure News
             </span>
           </button>
           <button 
             onClick={onAboutClick}
             className="relative overflow-hidden px-6 py-2.5 rounded-full bg-black/20 hover:bg-white hover:text-[#8B3A2B] border border-white/30 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl backdrop-blur-sm group/btn"
           >
             <span className="relative z-10 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#8B3A2B] group-hover/btn:bg-white animate-pulse" />
               About Platform
             </span>
           </button>
           {/* Accessibility Toolbar */}
           <AccessibilityToolbar />
           <div className="h-10 w-20 construction-stripes opacity-10 hidden md:block" />
        </div>

        {/* Ergonomic Visual Slant */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-black/5 skew-x-[-25deg] translate-x-1/2 pointer-events-none" />
      </div>

      {/* Modern Search & Actions Bar */}
      {showSearch && (
        <div className="bg-[#1A1A1A] p-4 flex items-center justify-between shadow-2xl relative z-20">
          <div className="w-full max-w-5xl mx-auto flex items-center gap-4">
            <div className="relative flex-grow group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <svg className="h-5 w-5 text-[#8B3A2B] group-focus-within:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="SEARCH INFRASTRUCTURE DATABASE..."
                className="block w-full pl-12 pr-4 py-3.5 border-none rounded-2xl leading-5 bg-[#2D2926] text-white font-black text-[11px] uppercase tracking-[0.2em] placeholder-gray-500 focus:ring-2 focus:ring-[#8B3A2B] outline-none transition-all shadow-2xl"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            {isAdmin && (
              <button 
                onClick={onAddClick}
                className="bg-[#8B3A2B] text-white rounded-2xl p-4 hover:bg-[#A54A39] transition-all shadow-xl active:scale-95 flex items-center gap-3 group"
                title="Post New Audit"
              >
                <div className="bg-white/20 p-1 rounded-md">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="hidden md:block text-[11px] font-black uppercase tracking-widest">Submit Audit</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
