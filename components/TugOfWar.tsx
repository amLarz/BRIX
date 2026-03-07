
import React from 'react';

interface TugOfWarProps {
  upvotes: number;
  downvotes: number;
}

const TugOfWar: React.FC<TugOfWarProps> = ({ upvotes, downvotes }) => {
  const total = upvotes + downvotes;
  const upPercent = total === 0 ? 50 : (upvotes / total) * 100;
  const downPercent = 100 - upPercent;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
        <span className="text-red-600">Critics ({downvotes})</span>
        <span className="text-green-600">Supporters ({upvotes})</span>
      </div>
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden flex shadow-inner border border-gray-300">
        <div 
          className="h-full bg-red-500 transition-all duration-700 ease-out flex items-center justify-end px-2"
          style={{ width: `${downPercent}%` }}
        >
           {downPercent > 15 && <span className="text-[8px] text-white font-bold">▼</span>}
        </div>
        <div 
          className="h-full bg-green-500 transition-all duration-700 ease-out flex items-center px-2"
          style={{ width: `${upPercent}%` }}
        >
           {upPercent > 15 && <span className="text-[8px] text-white font-bold">▲</span>}
        </div>
      </div>
      <div className="text-center">
        <span className={`text-xs font-bold uppercase ${upPercent > 50 ? 'text-green-600' : 'text-red-600'}`}>
          {upPercent > 50 ? 'Community Leans Positive' : 'High Transparency Concerns'}
        </span>
      </div>
    </div>
  );
};

export default TugOfWar;
