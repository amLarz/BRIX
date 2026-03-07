
import React from 'react';
import { Project, MaterialCategory } from '../types';
import ProjectCard from './ProjectCard';
import Sidebar from './Sidebar';

interface HomeProps {
  projects: Project[];
  categories: MaterialCategory[];
  onProjectClick: (id: string) => void;
  onCategoryClick: (id: string) => void;
  onVote: (projectId: string, type: 'up' | 'down') => void;
  sortOrder: 'recent' | 'trending';
  onSortChange: (order: 'recent' | 'trending') => void;
}

const Home: React.FC<HomeProps> = ({ 
  projects, 
  categories, 
  onProjectClick, 
  onCategoryClick, 
  onVote,
  sortOrder,
  onSortChange 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-3 order-2 lg:order-1">
        <Sidebar categories={categories} onCategoryClick={onCategoryClick} />
      </div>

      {/* Main Grid */}
      <div className="lg:col-span-9 order-1 lg:order-2">
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 border-b-4 border-[#8B3A2B]">ACTIVE DISCUSSIONS</h2>
            <div className="flex gap-2">
                <button 
                  onClick={() => onSortChange('trending')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
                    sortOrder === 'trending' 
                      ? 'bg-[#8B3A2B] text-white border-[#8B3A2B]' 
                      : 'bg-white text-gray-400 border-gray-200 hover:border-[#8B3A2B] hover:text-[#8B3A2B]'
                  }`}
                >
                  Trending
                </button>
                <button 
                  onClick={() => onSortChange('recent')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
                    sortOrder === 'recent' 
                      ? 'bg-[#8B3A2B] text-white border-[#8B3A2B]' 
                      : 'bg-white text-gray-400 border-gray-200 hover:border-[#8B3A2B] hover:text-[#8B3A2B]'
                  }`}
                >
                  Recent
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => onProjectClick(project.id)} 
              onVote={(type) => onVote(project.id, type)}
            />
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border-4 border-dashed border-gray-200">
              <p className="text-gray-400 font-black text-xl italic uppercase">NO MATCHING DATA FOUND</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
