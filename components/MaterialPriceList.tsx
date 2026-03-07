
import React, { useState } from 'react';
import { MaterialCategory } from '../types';
import { MaterialIcon } from './Sidebar';

interface MaterialPriceListProps {
  category: MaterialCategory;
  onBack: () => void;
}

const MaterialPriceList: React.FC<MaterialPriceListProps> = ({ category, onBack }) => {
  const [inspectorUrl, setInspectorUrl] = useState<string | null>(null);
  const showInspector = inspectorUrl !== null;
  const GLOBAL_DB_URL = "https://share.google/AaBXqWaNwFF6RrT0u";

  return (
    <div className="space-y-6 animate-in">
      <div className="bg-[#2D2926] text-white rounded-t-3xl overflow-hidden border-2 border-[#2D2926] shadow-xl">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          <div className="p-6 lg:w-1/3 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="bg-[#8B3A2B] p-3 rounded-2xl shadow-lg">
                 <MaterialIcon id={category.id} className="w-8 h-8 text-white" />
               </div>
               <h2 className="text-3xl font-black italic tracking-tighter uppercase">{category.name}</h2>
            </div>
            <div className="h-8 w-24 construction-stripes opacity-20" />
          </div>
          <div className="p-6 lg:w-48 flex items-center justify-center font-black italic uppercase text-2xl text-gray-400">
             {showInspector ? 'LIVE VIEW' : 'UNIT'}
          </div>
          <div className="p-6 flex-grow flex items-center justify-between font-black italic uppercase text-2xl px-8">
             <span className="text-gray-400">{showInspector ? 'EXTERNAL DATABASE' : 'PRICE IN PhP'}</span>
             <div className="flex items-center gap-4">
               <button 
                 onClick={() => setInspectorUrl(showInspector ? null : GLOBAL_DB_URL)}
                 className={`text-[10px] font-black uppercase px-6 py-3 rounded-full border-2 transition-all flex items-center gap-2 shadow-xl ${
                   showInspector 
                   ? 'bg-white text-[#8B3A2B] border-white scale-105' 
                   : 'bg-[#8B3A2B] text-white border-white/20 hover:bg-white hover:text-[#8B3A2B]'
                 }`}
               >
                 {showInspector ? '✕ Close Inspector' : '🔍 Inspect Live Data'}
               </button>
               <button 
                onClick={onBack}
                className="p-3 bg-[#8B3A2B] rounded-full border-2 border-white/20 hover:bg-white hover:text-[#8B3A2B] transition-all shadow-xl active:scale-90"
                title="Back to Home"
               >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
               </button>
             </div>
          </div>
        </div>
      </div>

      <div className="relative bg-[#EAD8B1] border-2 border-gray-900 rounded-b-3xl overflow-hidden shadow-2xl min-h-[600px]">
        {showInspector ? (
          <div className="w-full h-[800px] flex flex-col">
            <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                Secure Tunnel: Data Synced with National Standards
              </span>
              <a href={inspectorUrl || GLOBAL_DB_URL} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-[#EAD8B1] hover:underline uppercase tracking-widest">
                Launch External Console ↗
              </a>
            </div>
            <div className="flex-grow bg-white">
              <iframe 
                src={inspectorUrl || GLOBAL_DB_URL}
                className="w-full h-full border-none"
                title="Global Material Database Inspector"
              />
            </div>
            <div className="p-4 bg-gray-900 border-t border-white/10 flex justify-center gap-2">
               {[1,2,3,4,5,6].map(i => <div key={i} className="h-1.5 w-12 bg-[#8B3A2B]/40 rounded-full" />)}
            </div>
          </div>
        ) : (
          <div className="divide-y-2 divide-gray-900/10 animate-in fade-in">
             {category.items.map((item, idx) => (
               <div key={idx} className="flex flex-col lg:flex-row hover:bg-white/50 transition-colors group">
                  <div className="p-8 lg:w-1/3 text-xl font-black text-gray-900 lg:border-r-2 lg:border-gray-900/10 uppercase tracking-tighter">
                     {item.name}
                  </div>
                  <div className="p-8 lg:w-48 text-center text-lg font-bold text-gray-500 lg:border-r-2 lg:border-gray-900/10 bg-black/5 group-hover:bg-transparent transition-colors">
                     {item.unit}
                  </div>
                  <div className="p-8 flex-grow text-2xl font-black text-[#8B3A2B] pl-10 flex flex-col justify-center gap-1">
                     <div>{item.price}</div>
                     {item.sourceUrl && (
                       <div className="flex items-center gap-4">
                         <button 
                           onClick={() => setInspectorUrl(item.sourceUrl as string)}
                           className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline uppercase tracking-wider flex items-center gap-1 w-max opacity-80 hover:opacity-100 transition-opacity"
                         >
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                           </svg>
                           Inspect Source
                         </button>
                         <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-wider flex items-center gap-1 w-max opacity-80 hover:opacity-100 transition-opacity" title="Open in new tab">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                           </svg>
                         </a>
                       </div>
                     )}
                  </div>
               </div>
             ))}
             
             {/* Styled Placeholders */}
             {[1, 2].map(i => (
               <div key={`empty-${i}`} className="flex flex-col lg:flex-row opacity-20">
                  <div className="p-8 lg:w-1/3 lg:border-r-2 lg:border-gray-900/10 italic font-bold uppercase tracking-widest text-xs">Waiting for validation...</div>
                  <div className="p-8 lg:w-48 lg:border-r-2 lg:border-gray-900/10 italic font-bold">---</div>
                  <div className="p-8 flex-grow italic font-bold">Pending Sync</div>
               </div>
             ))}
          </div>
        )}
      </div>

      {!showInspector && (
        <div className="flex justify-between items-center mt-8 px-6">
           <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">
             Certified Pricing via PhilConPrices Standards API
           </div>
           <button 
             onClick={() => setInspectorUrl(GLOBAL_DB_URL)}
             className="flex items-center gap-3 group"
           >
              <div className="h-0.5 w-16 bg-gray-200 group-hover:bg-[#8B3A2B] group-hover:w-24 transition-all" />
              <span className="text-[10px] font-black text-gray-400 group-hover:text-[#8B3A2B] uppercase tracking-[0.2em] transition-colors">
                Open Inspector
              </span>
           </button>
        </div>
      )}
    </div>
  );
};

export default MaterialPriceList;
