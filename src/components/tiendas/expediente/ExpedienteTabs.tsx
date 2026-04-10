import React from 'react';

interface Props {
  activeTab: 'ficha' | 'bitacora';
  onTabChange: (tab: 'ficha' | 'bitacora') => void;
}

const ExpedienteTabs: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-100 px-6 bg-white overflow-hidden">
      <button
        onClick={() => onTabChange('ficha')}
        className={`px-8 py-4 text-[10px] font-black tracking-widest uppercase relative transition-colors ${
          activeTab === 'ficha' ? 'text-[#db3b2b]' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        FICHA TÉCNICA
        {activeTab === 'ficha' && (
          <div className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#db3b2b] rounded-t-full" />
        )}
      </button>
      <button
        onClick={() => onTabChange('bitacora')}
        className={`px-8 py-4 text-[10px] font-black tracking-widest uppercase relative transition-colors ${
          activeTab === 'bitacora' ? 'text-[#db3b2b]' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        BITÁCORA DE ASIGNACIÓN
        {activeTab === 'bitacora' && (
          <div className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#db3b2b] rounded-t-full" />
        )}
      </button>
    </div>
  );
};

export default ExpedienteTabs;
