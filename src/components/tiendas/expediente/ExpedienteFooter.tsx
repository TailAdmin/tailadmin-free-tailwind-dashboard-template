import React from 'react';
import { FileText } from 'lucide-react';

interface Props {
  onSears: (id: number) => void;
  onSanborns: (id: number) => void;
  onClose: () => void;
  searsMultilateralId?: number;
  sanbornsMultilateralId?: number;
}

const ExpedienteFooter: React.FC<Props> = ({
  onSears,
  onSanborns,
  onClose,
  searsMultilateralId,
  sanbornsMultilateralId
}) => {
  return (
    <div className="px-6 pb-6 pt-2 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {searsMultilateralId && (
          <ContractButton
            label="CONTRATO SEARS"
            onClick={() => onSears(searsMultilateralId)}
          />
        )}
        {sanbornsMultilateralId && (
          <ContractButton
            label="CONTRATO SANBORNS"
            onClick={() => onSanborns(sanbornsMultilateralId)}
          />
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-[#111827] text-white-2 px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
        >
          CERRAR EXPEDIENTE
        </button>
      </div>
    </div>
  );
};

const ContractButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-[#1e293b] text-white-2 py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-[#0f172a] transition-all group shadow-md"
  >
    <FileText size={16} className="text-gray-400 group-hover:text-white-2 transition-colors" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default ExpedienteFooter;
