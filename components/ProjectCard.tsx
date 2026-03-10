
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onVote: (type: 'up' | 'down') => void;
  currentUserVote: 'up' | 'down' | null;
  isAdmin?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onVote, currentUserVote, isAdmin }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col group border border-gray-100 hover:border-[#8B3A2B]/20 transition-all duration-300">
      <div className="relative h-56 overflow-hidden cursor-pointer" onClick={onClick}>
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg ${project.status === 'Finished Project' ? 'bg-green-500 text-white' : 'bg-[#8B3A2B] text-white'
            }`}>
            {project.status}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
          {project.deadline && (
            <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-right">
              <span className="block text-[8px] font-black text-white/60 uppercase leading-none mb-0.5">TARGET COMPLETION</span>
              <span className="text-white font-bold text-[10px]">{project.deadline}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3
          className="text-xl font-extrabold text-gray-900 leading-tight mb-1 cursor-pointer hover:text-[#8B3A2B] transition-colors uppercase tracking-tighter"
          onClick={onClick}
        >
          {project.name}
        </h3>
        <p className="text-[#8B3A2B] text-sm font-black tracking-tight mb-2">
          {project.budget}
        </p>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-4 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
          {project.location}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); if (!isAdmin) onVote('up'); }}
              disabled={isAdmin}
              title={isAdmin ? "Voting disabled for administrators" : ""}
              className={`flex items-center gap-1.5 group/btn ${isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all ${currentUserVote === 'up'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                  : `bg-gray-100 text-gray-400 ${!isAdmin ? 'group-hover/btn:bg-green-500 group-hover/btn:text-white' : ''}`
                }`}>▲</span>
              <span className={`text-sm font-black ${currentUserVote === 'up' ? 'text-green-600' : 'text-gray-400'}`}>{project.upvotes}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); if (!isAdmin) onVote('down'); }}
              disabled={isAdmin}
              title={isAdmin ? "Voting disabled for administrators" : ""}
              className={`flex items-center gap-1.5 group/btn ${isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all ${currentUserVote === 'down'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                  : `bg-gray-100 text-gray-400 ${!isAdmin ? 'group-hover/btn:bg-red-500 group-hover/btn:text-white' : ''}`
                }`}>▼</span>
              <span className={`text-sm font-black ${currentUserVote === 'down' ? 'text-red-600' : 'text-gray-400'}`}>{project.downvotes}</span>
            </button>
          </div>
          <button
            onClick={onClick}
            className="text-[10px] font-black uppercase tracking-widest text-[#8B3A2B] hover:underline"
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
