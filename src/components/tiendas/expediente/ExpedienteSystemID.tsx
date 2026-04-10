import React from 'react';

interface Props {
  idt1: string;
  store_portal_id: string;
  legacy_finance_id: string | number;
  portalStatus: boolean | null;
}
const ExpedienteSystemID: React.FC<Props> = ({ idt1, store_portal_id, legacy_finance_id, portalStatus }) => {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-[10px] font-black text-[#db3b2b] uppercase tracking-[0.15em] mb-4">
        IDENTIFICADORES DE SISTEMA
      </h3>
      <div className="grid grid-cols-4 gap-4">
        <IDCard label="IDT1" value={idt1} highlight />
        <IDCard label="ID PORTAL" value={store_portal_id} />
        <IDCard label="LEGACY FINANCE ID" value={legacy_finance_id || "N/A"} />
        <StatusCard status={portalStatus} />
      </div>
    </div>
  );
};

const IDCard = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
  <div className="bg-white border border-gray-100 rounded-lg p-3 text-center shadow-sm">
    <div className="text-[8px] font-bold text-gray-800 uppercase mb-1 tracking-widest">{label}</div>
    <div className={`text-lg font-black ${highlight ? 'text-[#db3b2b]' : 'text-gray-700'}`}>
      {highlight ? value : (value || 'N/A')}
    </div>
  </div>
);

const StatusCard = ({ status }: { status: boolean | null }) => {
  const isActive = status === true;
  const isNone = status === null;
  return (
    <div className={`border rounded-lg p-3 text-center shadow-sm ${isNone ? 'bg-gray-50 border-gray-100' :
      isActive ? 'bg-[#f0fdf4] border-[#dcfce7]' : 'bg-[#fff1f1] border-[#fee2e2]'
      }`}>
      <div className={`text-[8px] font-bold uppercase mb-1 tracking-widest ${isNone ? 'text-gray-400' :
        isActive ? 'text-[#22c55e]' : 'text-[#ef4444]'
        }`}>
        ESTATUS PORTAL
      </div>
      <div className={`text-lg font-black uppercase ${isNone ? 'text-gray-400' :
        isActive ? 'text-[#15803d]' : 'text-[#b91c1c]'
        }`}>
        {isNone ? 'CARGANDO...' : isActive ? 'ACTIVO' : 'INACTIVO'}
      </div>
    </div>
  );
};

export default ExpedienteSystemID;
