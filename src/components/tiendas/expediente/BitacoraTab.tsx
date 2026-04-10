import React from 'react';

interface Movement {
  fecha: string;
  usuarioResponsable: string;
  evento: 'ASIGNACIÓN' | 'DESASIGNACIÓN';
  soporte: string;
}

const BitacoraTab: React.FC = () => {
  const movements: Movement[] = [
    {
      fecha: '01/04/2026 12:10',
      usuarioResponsable: 'admin@t1.com',
      evento: 'ASIGNACIÓN',
      soporte: 'SOPORTE@T1ENVIOS.COM'
    },
    {
      fecha: '30/03/2026 09:45',
      usuarioResponsable: 'admin@t1.com',
      evento: 'DESASIGNACIÓN',
      soporte: 'SISTEMAS@T1.COM'
    }
  ];

  return (
    <div className="p-6 pb-2">
      <h3 className="text-[10px] font-black text-[#db3b2b] uppercase tracking-[0.15em] mb-4">
        HISTORIAL DE MOVIMIENTOS
      </h3>
      
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <Th>FECHA/HORA</Th>
              <Th>USUARIO RESPONSABLE</Th>
              <Th>EVENTO</Th>
              <Th>SOPORTE</Th>
            </tr>
          </thead>
          <tbody>
            {movements.map((move, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <Td className="text-gray-400 italic font-medium">{move.fecha}</Td>
                <Td className="text-gray-500 italic lowercase">{move.usuarioResponsable}</Td>
                <Td>
                  <span className={`font-black italic text-[11px] ${
                    move.evento === 'ASIGNACIÓN' ? 'text-[#10b981]' : 'text-[#db3b2b]'
                  }`}>
                    {move.evento}
                  </span>
                </Td>
                <Td className="text-gray-500 italic font-medium">{move.soporte}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
    {children}
  </th>
);

const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-5 text-[11px] ${className}`}>
    {children}
  </td>
);

export default BitacoraTab;
