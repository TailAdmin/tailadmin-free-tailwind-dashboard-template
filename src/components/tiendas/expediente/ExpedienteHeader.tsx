import React from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  onClose: () => void;
}

const ExpedienteHeader: React.FC<Props> = ({ title, onClose }) => {
  return (
    <div className="bg-[#111827] text-white-2 px-6 py-4 flex items-center justify-between rounded-t-xl">
      <h2 className="text-xl font-black italic tracking-tight">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white-2 transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default ExpedienteHeader;
