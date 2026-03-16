import React from 'react';

export interface ProjectUpdate {
  date: string;
  text: string;
}

interface ProjectProgressBarProps {
  projectName?: string;
  percentage?: number;
  startDate?: string;
  estimatedEnd?: string;
  updates?: ProjectUpdate[];
}

export default function ProjectProgressBar({
  projectName = "North Bridge",
  percentage = 62,
  startDate = "Jan 12, 2025",
  estimatedEnd = "Dec 2025",
  updates = [],
}: ProjectProgressBarProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 font-sans max-w-full">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[13px] font-black uppercase tracking-widest text-gray-900">
          {projectName}
        </span>
        <span className="text-[14px] font-black text-[#8B3A2B]">
          {percentage}%
        </span>
      </div>

      <div className="h-3 bg-gray-100 border border-gray-200 rounded-full overflow-hidden mb-1 relative">
        <div
          className="h-full bg-[#8B3A2B] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
        {/* Subtle animated pattern overlay could go here, but keeping it minimal */}
      </div>

      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
        <span>{startDate}</span>
        <span>Est. {estimatedEnd}</span>
      </div>

      {updates.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
          {updates.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 text-sm mt-1">
              <div className="flex items-center gap-3 sm:w-1/3 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#8B3A2B] flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {item.date}
                </span>
              </div>
              <span className="text-gray-700 font-medium leading-relaxed sm:w-2/3">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
