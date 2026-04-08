import React from 'react';

interface Props {
  idt1: string;
  idPortal: string;
  idAs400: string;
  status: string;
}

const ExpedienteSystemID: React.FC<Props> = ({ idt1, idPortal, idAs400, status }) => {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-[10px] font-black text-[#db3b2b] uppercase tracking-[0.15em] mb-4">
        IDENTIFICADORES DE SISTEMA
      </h3>
      <div className="grid grid-cols-4 gap-4">
        <IDCard label="IDT1" value={idt1} highlight />
        <IDCard label="ID PORTAL" value={idPortal} />
        <IDCard label="ID AS400" value={idAs400} />
        <StatusCard status={status} />
      </div>
    </div>
  );
};

const IDCard = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className="bg-white border border-gray-100 rounded-lg p-3 text-center shadow-sm">
    <div className="text-[8px] font-bold text-gray-300 uppercase mb-1 tracking-widest">{label}</div>
    <div className={`text-lg font-black ${highlight ? 'text-[#db3b2b]' : 'text-gray-700'}`}>
      {highlight ? value : (value || 'N/A')}
    </div>
  </div>
);

const StatusCard = ({ status }: { status: string }) => (
  <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-lg p-3 text-center shadow-sm">
    <div className="text-[8px] font-bold text-[#22c55e] uppercase mb-1 tracking-widest">ESTATUS PORTAL</div>
    <div className="text-lg font-black text-[#15803d] uppercase">
      {status}
    </div>
  </div>
);

export default ExpedienteSystemID;
