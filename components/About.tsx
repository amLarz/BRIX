
import React from 'react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in pb-24">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-gray-900 pb-6 gap-4">
         <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-4 bg-[#8B3A2B] text-white rounded-2xl hover:bg-[#6A2B20] transition-all shadow-xl active:scale-90">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
            </button>
            <div>
              <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Platform Blueprint</h2>
              <p className="text-[10px] font-bold text-[#8B3A2B] uppercase tracking-[0.2em] mt-2">Promoting Transparency & Accountability through Community Platforms</p>
            </div>
         </div>
         <div className="text-right">
            <span className="text-sm font-black text-gray-900">OCTOBER 9, 2025</span>
         </div>
      </div>

      {/* Research Background */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-8 space-y-10">
           <div className="space-y-4">
              <span className="bg-[#8B3A2B] text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">The Mission</span>
              <h3 className="text-5xl lg:text-6xl font-black italic tracking-tighter leading-none text-gray-900">
                DEFENDING THE INTEGRITY OF PUBLIC PROJECTS.
              </h3>
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                Corruption in the Philippines remains a critical bottleneck for development. Research indicates that infrastructure projects frequently experience <strong>35% budget leakage</strong> to illicit payments, resulting in "Ghost Projects" that exist on paper but leave communities underwater or stranded. BRIX is the digital response to this systemic failure.
              </p>
           </div>

           <div className="bg-[#FDF7E7] p-10 rounded-[3rem] border-l-8 border-[#8B3A2B] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-black italic uppercase mb-4 text-[#8B3A2B]">The Bulacan Incident (Ref 4.1)</h4>
                <p className="text-gray-700 font-medium italic leading-relaxed">
                  "The inspiration for BRIX came from the <strong>₱96.49 million Bulacan flood control project</strong>. Despite being marked as complete in official databases, residents remained submerged during typhoons. We aim to ensure that site reality matches government reports."
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-32 h-32 construction-stripes opacity-10" />
           </div>
        </section>

        <section className="lg:col-span-4 space-y-6">
           <div className="bg-[#1A1A1A] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col h-full border-t-4 border-[#8B3A2B]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-[#8B3A2B]">Founding Architects</h4>
              <ul className="space-y-8 relative z-10 flex-grow">
                 <li className="flex flex-col group">
                    <span className="text-xl font-black italic group-hover:text-[#8B3A2B] transition-colors">Sofia Abigail Roa Awayan</span>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">HEAD OF RESEARCH</span>
                 </li>
                 <li className="flex flex-col group">
                    <span className="text-xl font-black italic group-hover:text-[#8B3A2B] transition-colors">Nala Olivia Baylon Escopete</span>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">VISIONARY</span>
                 </li>
                 <li className="flex flex-col group">
                    <span className="text-xl font-black italic group-hover:text-[#8B3A2B] transition-colors">Lance Angelo Celebrado Roco</span>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">LEAD PROGRAMMER</span>
                 </li>
                 <li className="flex flex-col group">
                    <span className="text-xl font-black italic group-hover:text-[#8B3A2B] transition-colors">Cian Josef Enriquez</span>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">RESEARCHER</span>
                 </li>
              </ul>
              <div className="mt-8 text-[9px] font-bold text-gray-600 uppercase tracking-widest">BRIX FOUNDATION DEPT.</div>
           </div>
        </section>
      </div>

      {/* SDG Alignment Statement with Natural High Contrast Colors */}
      <section className="space-y-12">
         <div className="text-center">
            <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#8B3A2B] mb-3">Global Impact Alignment</h4>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">Sustainable Development Goals</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: '6', title: 'Clean Water', desc: 'Ensuring sanitation projects reach target efficiency through community monitoring.', color: 'bg-[#0077B6]' },
              { id: '9', title: 'Infrastructure', desc: 'Promoting quality and stability in every brick laid and every road paved.', color: 'bg-[#008080]' },
              { id: '11', title: 'Sustainable Cities', desc: 'Empowering settlements with the knowledge to maintain long-term urban resilience.', color: 'bg-[#A67C00]' },
              { id: '16', title: 'Peace & Justice', desc: 'Eliminating the "Ghost Project" through transparent, community-led auditing.', color: 'bg-[#4B5563]' }
            ].map((sdg) => (
              <div key={sdg.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                 <div className={`${sdg.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                   {sdg.id}
                 </div>
                 <h5 className="text-xl font-black italic uppercase text-gray-900 mb-3">{sdg.title}</h5>
                 <p className="text-sm text-gray-500 font-bold leading-relaxed">{sdg.desc}</p>
                 <div className="absolute -bottom-2 -right-2 text-gray-50 font-black text-6xl select-none group-hover:text-gray-100 transition-colors">SDG</div>
              </div>
            ))}
         </div>
      </section>

      {/* Objectives Segment */}
      <section className="bg-[#8B3A2B] text-white p-12 lg:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">
         <div className="max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/50 mb-8">System Objectives</h4>
              <ul className="space-y-10">
                 {[
                   "Providing current information on average pricing of raw materials to prevent cost overruns.",
                   "Publicly displaying set budgets to highlight potential leakages in government funding.",
                   "Implementing an active update system for deadlines to ensure timely project delivery."
                 ].map((text, i) => (
                   <li key={i} className="flex gap-6 group/item">
                      <span className="text-white/20 font-black text-5xl italic leading-none group-hover/item:text-white transition-colors">0{i+1}</span>
                      <p className="text-lg lg:text-xl font-black italic leading-tight text-white/90">{text}</p>
                   </li>
                 ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center items-center lg:items-end text-center lg:text-right space-y-6">
               <div className="bg-white/10 p-8 rounded-full border-4 border-white/20 backdrop-blur-md">
                 <div className="text-6xl">🏗️</div>
               </div>
               <p className="text-sm font-black uppercase tracking-[0.4em] text-white/40">Verified Audit Engine</p>
            </div>
         </div>
         <div className="absolute top-0 right-0 h-full w-1/3 bg-black/5 -skew-x-12 translate-x-20 pointer-events-none" />
      </section>

      {/* Closing Quote */}
      <div className="text-center max-w-3xl mx-auto space-y-8 pt-10">
         <div className="flex justify-center gap-3">
            {[1,2,3].map(i => <div key={i} className="h-2 w-12 bg-gray-200 rounded-full" />)}
         </div>
         <h4 className="text-3xl lg:text-5xl font-black italic tracking-tighter text-gray-900 leading-tight">
           "Together, let's construct a resilient future—strengthened by accountability and powered by the people, <span className="text-[#8B3A2B] underline decoration-4 underline-offset-8">building trust brick by Brix.</span>"
         </h4>
         <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.8em]">BRIX FOUNDATION © 2025</p>
      </div>
    </div>
  );
};

export default About;
