
import React from 'react';
import { MaterialCategory } from '../types';

interface SidebarProps {
  categories: MaterialCategory[];
  onCategoryClick: (id: string) => void;
}

export const MaterialIcon = ({ id, className }: { id: string, className?: string }) => {
  const props = { className: className || "w-8 h-8", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  
  switch (id) {
    case 'cement':
      return (
        <svg {...props}>
          <path d="M6 3h12l2 4v14H4V7l2-4z" />
          <path d="M8 10h8" />
          <rect x="9" y="14" width="6" height="3" rx="1" />
        </svg>
      );
    case 'hollow-blocks':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M8 10v4" />
          <path d="M12 10v4" />
          <path d="M16 10v4" />
        </svg>
      );
    case 'plywoods':
      return (
        <svg {...props}>
          <path d="M4 14l16-4v10l-16 4V14z" />
          <path d="M4 9l16-4v5l-16 4V9z" />
          <path d="M4 4l16-4v5l-16 4V4z" />
        </svg>
      );
    case 'paints':
      return (
        <svg {...props}>
          <path d="M19 11l-7-7-7 7" />
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M9 11v3" />
          <path d="M15 11v3" />
        </svg>
      );
    case 'steel':
      return (
        <svg {...props}>
          <path d="M8 3v18" />
          <path d="M12 3v18" />
          <path d="M16 3v18" />
          <path d="M8 7h8" />
          <path d="M8 12h8" />
          <path d="M8 17h8" />
        </svg>
      );
    default:
      return <span className="text-2xl">📦</span>;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ categories, onCategoryClick }) => {
  const getCategoryColor = (id: string) => {
    switch(id) {
      case 'cement': return 'bg-[#A0AEC0]'; // Natural Concrete Dust
      case 'hollow-blocks': return 'bg-[#718096]'; // Heavy Masonry Gray
      case 'plywoods': return 'bg-[#B7791F]'; // Warm Timber
      case 'paints': return 'bg-[#3182CE]'; // Industrial Blue
      case 'steel': return 'bg-[#2D3748]'; // Carbon Steel
      default: return 'bg-[#4A5568]';
    }
  };

  return (
    <aside className="bg-[#8B3A2B] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#8B3A2B]">
      <div className="bg-[#8B3A2B] p-4 border-b-2 border-white/10 flex items-center justify-between">
        <h2 className="text-white font-black italic tracking-tighter text-xl uppercase">Reference Hub</h2>
        <div className="flex gap-1.5">
          {[1,2,3].map(i => <div key={i} className="h-4 w-1 bg-white/20 rotate-12 rounded-full" />)}
        </div>
      </div>
      
      <div className="p-5 grid grid-cols-2 gap-4 bg-[#6A2B20]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className="flex flex-col items-center justify-center p-4 rounded-[2rem] aspect-square transition-all hover:scale-105 hover:shadow-2xl active:scale-95 group relative overflow-hidden"
          >
            <div className={`absolute inset-0 opacity-90 transition-opacity group-hover:opacity-100 ${getCategoryColor(cat.id)}`} />
            
            <div className="z-10 flex flex-col items-center gap-2 text-white">
              <MaterialIcon id={cat.id} className="w-10 h-10 group-hover:rotate-6 transition-transform" />
              <span className="text-[10px] font-black leading-tight text-center uppercase tracking-widest opacity-90 group-hover:opacity-100">
                {cat.name}
              </span>
            </div>
            
            {/* Subtle gloss effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </button>
        ))}
      </div>

      <div className="h-20 bg-[#6A2B20] flex items-center justify-center px-6">
        <div className="w-full h-1 bg-white/10 rounded-full relative">
           <div className="absolute top-0 left-0 w-1/3 h-full bg-[#8B3A2B] rounded-full shadow-[0_0_10px_rgba(139,58,43,0.5)]" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
