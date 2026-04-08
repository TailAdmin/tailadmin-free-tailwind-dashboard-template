import React, { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import ExpedienteHeader from './ExpedienteHeader';
import ExpedienteTabs from './ExpedienteTabs';
import ExpedienteSystemID from './ExpedienteSystemID';
import FiscalInfoSection from './FiscalInfoSection';
import OwnerInfoSection from './OwnerInfoSection';
import ExpedienteFooter from './ExpedienteFooter';
import BitacoraTab from './BitacoraTab';

interface Props {
  open: boolean;
  onClose: () => void;
  tienda: any; // Can be typed properly if needed
}

const ExpedienteModal: React.FC<Props> = ({ open, onClose, tienda }) => {
  const [activeTab, setActiveTab] = useState<'ficha' | 'bitacora'>('ficha');

  if (!tienda) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#f8fafc' // Light background matching image
        }
      }}
    >
      <ExpedienteHeader title={tienda.nombre} onClose={onClose} />
      <ExpedienteTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <DialogContent sx={{ p: 0 }}>
        {activeTab === 'ficha' ? (
          <div className="animate-in fade-in duration-300">
            <ExpedienteSystemID 
              idt1={tienda.idt1} 
              idPortal={tienda.idt1} // Using same as mock
              idAs400=""
              status="ACTIVO"
            />
            
            <FiscalInfoSection 
              razonSocial={`${tienda.nombre} S.A. DE C.V.`}
              rfc="RFC987654321"
              regimenFiscal="601 - G. Ley Personas Morales"
              direccion="Av. Paseo de la Reforma 222, Cuauhtémoc, Ciudad de México, CP 06600"
            />
            
            <OwnerInfoSection 
              nombre="DANIEL GARCIA"
              email="PRUEBA@CLARO.COM"
              tel="5534277789"
            />
            
            <ExpedienteFooter 
              onSears={() => console.log('Sears')}
              onSanborns={() => console.log('Sanborns')}
              onClose={onClose}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <BitacoraTab />
            <div className="px-6 pb-6 flex justify-end">
              <button
                onClick={onClose}
                className="bg-[#111827] text-white px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
              >
                CERRAR EXPEDIENTE
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExpedienteModal;
