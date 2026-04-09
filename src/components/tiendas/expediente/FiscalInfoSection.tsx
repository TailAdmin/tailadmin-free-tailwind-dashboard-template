import React from 'react';

interface Props {
  razonSocial: string;
  rfc: string;
  regimenFiscal: string;
  direccion: string;
}

const FiscalInfoSection: React.FC<Props> = ({ razonSocial, rfc, regimenFiscal, direccion }) => {
  return (
    <div className="px-6 pb-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <h3 className="text-[10px] font-black text-[#db3b2b] uppercase tracking-[0.15em] mb-6 border-b border-gray-50 pb-2">
          INFORMACIÓN FISCAL
        </h3>

        <div className="grid grid-cols-2 gap-y-6">
          <div className="col-span-2">
            <Label>RAZÓN SOCIAL</Label>
            <Value>{razonSocial}</Value>
          </div>

          <div>
            <Label>RFC</Label>
            <Value>{rfc}</Value>
          </div>

          <div>
            <Label>RÉGIMEN FISCAL</Label>
            <Value className="italic text-blue-800">{regimenFiscal}</Value>
          </div>

          <div className="col-span-2">
            <Label>DIRECCIÓN FISCAL</Label>
            <Value className="text-[11px] leading-relaxed">{direccion}</Value>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[8px] font-bold text-gray-800 uppercase mb-1 tracking-widest">{children}</div>
);

const Value = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm font-black text-gray-800 uppercase ${className}`}>{children}</div>
);

export default FiscalInfoSection;
