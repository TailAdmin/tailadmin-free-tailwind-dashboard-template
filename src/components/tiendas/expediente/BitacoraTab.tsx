import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import storeService from '../../../services/storeService';
import type { Assignment } from '../../../models/assignment';

interface Props {
  storeId: string | number;
}

const BitacoraTab: React.FC<Props> = ({ storeId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await storeService.getAssignmentsByStore(storeId);
        setAssignments(data);
      } catch (err: any) {
        console.error('Error fetching store assignments:', err);
        setError(err.message || 'Error al cargar la bitácora');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + d.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 pb-2">
      <h3 className="text-[10px] font-black text-[#db3b2b] uppercase tracking-[0.15em] mb-4">
        HISTORIAL DE MOVIMIENTOS
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <CircularProgress size={28} sx={{ color: '#db3b2b' }} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-[#db3b2b] px-4 py-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm font-medium italic">
          Sin movimientos registrados
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <Th>FECHA/HORA</Th>
                <Th>USUARIO RESPONSABLE</Th>
                <Th>EVENTO</Th>
                <Th>SOPORTE</Th>
                <Th>COMENTARIO</Th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <Td className="text-gray-400 italic font-medium">{formatDate(a.createdAt)}</Td>
                  <Td className="text-gray-500 italic lowercase">{a.user?.email || '—'}</Td>
                  <Td>
                    <span className={`font-black italic text-[11px] ${a.autorizado ? 'text-[#10b981]' : 'text-[#db3b2b]'}`}>
                      {a.autorizado ? 'ASIGNACIÓN' : 'DESASIGNACIÓN'}
                    </span>
                  </Td>
                  <Td className="text-gray-500 italic font-medium uppercase">{a.email}</Td>
                  <Td className="text-gray-400 italic text-[10px]">{a.comentario || '—'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
