import React from 'react';

interface Props {
  nombre: string;
  email: string;
  tel: string;
}

const OwnerInfoSection: React.FC<Props> = ({ nombre, email, tel }) => {
  return (
    <div className="px-6 pb-6">
      <div className="bg-white border border-red-50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <h3 className="text-[10px] font-black text-[#db3b2b] uppercase tracking-[0.15em] mb-6 border-b border-red-50/50 pb-2">
          DATOS DEL OWNER
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>NOMBRE</Label>
            <Value>{nombre}</Value>
          </div>

          <div>
            <Label>EMAIL</Label>
            <Value className="text-[#db3b2b] underline lowercase font-bold">{email}</Value>
          </div>

          <div>
            <Label>TEL</Label>
            <Value>{tel}</Value>
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

export default OwnerInfoSection;
