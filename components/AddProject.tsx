
import React, { useState, useRef, useEffect } from 'react';
import { Project, ProjectStatus, MaterialItem } from '../types';
import { moderateComment } from '../moderation';
import { moderateImage } from '../imageModeration';

interface AddProjectProps {
  onBack: () => void;
  // Fix: Omit createdAt from the input parameter type as it is generated in App.tsx
  onSubmit: (project: Omit<Project, 'id' | 'upvotes' | 'downvotes' | 'comments' | 'createdAt'>) => void;
}

const AddProject: React.FC<AddProjectProps> = ({ onBack, onSubmit }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Developing Project');
  const [image, setImage] = useState<string | null>(null);
  const [isModerating, setIsModerating] = useState(false);
  const [verificationDoc, setVerificationDoc] = useState<string | null>(null);
  const [materials, setMaterials] = useState<MaterialItem[]>([
    { material: '', unit: '', price: '' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsModerating(true);
      const url = URL.createObjectURL(file);
      
      try {
        const result = await moderateImage(url);
        
        if (image && image.startsWith('blob:')) {
          URL.revokeObjectURL(image);
        }
        setImage(url);

      } catch (err) {
        console.error("Moderation failed", err);
        // Default to allow if check fails (or choice based on product needs)
        setImage(url);
      } finally {
        setIsModerating(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (image && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload with name
      setVerificationDoc(file.name);
    }
  };

  const addMaterialRow = () => {
    setMaterials([...materials, { material: '', unit: '', price: '' }]);
  };

  const updateMaterial = (index: number, field: keyof MaterialItem, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setMaterials(newMaterials);
  };

  const handleFinalSubmit = () => {
    if (!name || !location || !deadline || !budget || !verificationDoc) {
      alert("Please fill in all required fields: Title, Location, Budget, Deadline, and Verification Document.");
      return;
    }

    // Moderation Checks
    const nameModeration = moderateComment(name);
    if (!nameModeration.isAllowed) {
      alert(`Title check failed: ${nameModeration.reason}`);
      return;
    }

    if (description) {
      const descModeration = moderateComment(description);
      if (!descModeration.isAllowed) {
        alert(`Description check failed: ${descModeration.reason}`);
        return;
      }
    }

    onSubmit({
      name,
      location,
      budget,
      deadline,
      description: description || "New transparency project added by the community.",
      status,
      verificationDoc,
      imageUrl: image || 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=1000',
      materials: materials.filter(m => m.material && m.price),
      finishDate: status === 'Finished Project' ? new Date().toLocaleDateString('en-GB') : undefined
    });
  };

  // Standardized input classes for high consistency
  const inputBaseClass = "w-full outline-none transition-all rounded-t-lg bg-[#FDF7E7]/30 border-b-2 border-gray-200 focus:border-[#8B3A2B] px-3 py-2 text-gray-900 placeholder:text-gray-300";
  const labelBaseClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in pb-20">
      <div className="flex items-center gap-4">
         <button onClick={onBack} className="p-2 bg-white rounded-full border-2 border-gray-200 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
         </button>
         <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Add New Project</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div 
            onClick={() => !isModerating && fileInputRef.current?.click()}
            className={`w-full aspect-video rounded-[2.5rem] border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#8B3A2B] hover:bg-white transition-all overflow-hidden relative shadow-inner ${image ? 'border-none' : ''} ${isModerating ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isModerating ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border-4 border-[#8B3A2B] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8B3A2B] animate-pulse">Analyzing...</span>
              </div>
            ) : image ? (
              <img src={image} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-4xl font-light mb-2">+</div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Add Project Image</span>
              </>
            )}
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isModerating} />
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
             <div className="group">
               <label className={labelBaseClass}>Project Title*</label>
               <input 
                 type="text" 
                 placeholder="Insert name of project" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className={`${inputBaseClass} text-2xl font-black uppercase tracking-tighter`}
               />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className={labelBaseClass}>Location*</label>
                  <input 
                    type="text" 
                    placeholder="Province, City" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`${inputBaseClass} font-bold`}
                  />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="group">
                   <label className={labelBaseClass}>Total Budget*</label>
                   <input 
                     type="text" 
                     placeholder="e.g. PhP 50,000,000.00" 
                     value={budget}
                     onChange={(e) => setBudget(e.target.value)}
                     className={`${inputBaseClass} font-bold text-[#8B3A2B]`}
                   />
                 </div>
                 <div className="group">
                   <label className={labelBaseClass}>Expected Completion*</label>
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={`${inputBaseClass} font-bold`}
                  />
                </div>
             </div>

             <div className="group">
                <label className={labelBaseClass}>Description</label>
                <textarea 
                  placeholder="Brief project description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 p-4 bg-[#FDF7E7]/20 border border-gray-100 rounded-2xl text-sm placeholder:text-gray-300 focus:ring-4 focus:ring-[#8B3A2B]/10 outline-none transition-all"
                />
             </div>

             {/* VERIFICATION DOCUMENT SEGMENT */}
             <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-lg bg-[#8B3A2B] flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   </div>
                   <div className="flex-grow">
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-1">Verification Document*</h4>
                      <p className="text-[10px] text-gray-500 font-bold mb-3 leading-tight uppercase">Upload the official project signboard info or PDF documentation for transparency verification.</p>
                      
                      {verificationDoc ? (
                         <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-green-200">
                            <span className="text-[10px] font-mono text-green-700 truncate max-w-[200px]">{verificationDoc}</span>
                            <button onClick={() => setVerificationDoc(null)} className="text-red-500 font-black text-xs hover:scale-110">×</button>
                         </div>
                      ) : (
                        <button 
                          onClick={() => docInputRef.current?.click()}
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          Select File
                        </button>
                      )}
                      <input ref={docInputRef} type="file" className="hidden" accept=".pdf,image/*" onChange={handleDocChange} />
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           {/* Standardized Materials Input UI */}
           <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
             <div className="bg-gray-900 p-4 flex justify-between items-center">
                <div className="flex items-center gap-8 w-full">
                   <span className="text-white text-[10px] font-black uppercase tracking-widest w-24">QUANTITY</span>
                   <span className="text-white text-[10px] font-black uppercase tracking-widest w-24">PRICE</span>
                   <span className="text-white text-[10px] font-black uppercase tracking-widest flex-grow flex items-center justify-between">
                     MATERIAL
                     <div className="h-6 w-16 construction-stripes opacity-30" />
                   </span>
                </div>
             </div>
             <div className="p-4 space-y-3">
                {materials.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-2 border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-[#8B3A2B]/20">
                     <input 
                       className="w-24 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold" 
                       placeholder="e.g. 10 Bags" 
                       value={m.unit} 
                       onChange={(e) => updateMaterial(i, 'unit', e.target.value)} 
                     />
                     <input 
                       className="w-24 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-black text-[#8B3A2B]" 
                       placeholder="~PhP 3,000" 
                       value={m.price} 
                       onChange={(e) => updateMaterial(i, 'price', e.target.value)} 
                     />
                     <input 
                       className="flex-grow bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold" 
                       placeholder="Material Name" 
                       value={m.material} 
                       onChange={(e) => updateMaterial(i, 'material', e.target.value)} 
                     />
                  </div>
                ))}
                <button 
                  onClick={addMaterialRow}
                  className="w-full py-2 bg-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:bg-gray-200 transition-colors"
                >+ Add More Material</button>
             </div>
           </div>

           <div className="space-y-4">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-1">
                     <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Project Configuration</h4>
                     <p className="font-bold text-gray-900 text-sm">Change Project Status</p>
                  </div>
                  
                  <div className="relative bg-gray-200/50 p-1 rounded-2xl flex w-full max-w-[320px] self-center">
                     {/* Animated Background Indicator */}
                     <div 
                       className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-white rounded-xl shadow-md transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                         status === 'Finished Project' 
                           ? 'translate-x-[calc(100%+0.25rem)]' 
                           : 'translate-x-0'
                       }`} 
                     />
                     
                     <button 
                       type="button"
                       onClick={() => setStatus('Developing Project')}
                       className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                         status === 'Developing Project' ? 'text-[#8B3A2B]' : 'text-gray-400 hover:text-gray-600'
                       }`}
                     >
                       Developing
                     </button>
                     <button 
                       type="button"
                       onClick={() => setStatus('Finished Project')}
                       className={`relative z-10 flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                         status === 'Finished Project' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                       }`}
                     >
                       Finished
                     </button>
                  </div>
               </div>

              <button 
                onClick={handleFinalSubmit}
                className="w-full py-5 bg-[#8B3A2B] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#6A2B20] transition-all hover:scale-[1.02] active:scale-95 text-sm"
              >
                Post to Discussions
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
