
import React from 'react';
import { useAccessibility } from './AccessibilityContext';

const AccessibilityToast: React.FC = () => {
  const { showToast, toastMessage } = useAccessibility();

  return (
    <div
      className={`fixed top-[68px] left-1/2 -translate-x-1/2 bg-[#1f2937] text-gray-100 rounded-full px-4 py-2 text-xs flex items-center gap-2 z-[400] whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-200 pointer-events-none ${
        showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
      }`}
    >
      <div className="w-2 h-2 rounded-full bg-red-400 acc-rec-pulse flex-shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};

export default AccessibilityToast;
