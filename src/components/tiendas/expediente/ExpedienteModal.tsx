import React, { useState } from 'react';
import { Dialog, DialogContent, CircularProgress } from '@mui/material';
import ExpedienteHeader from './ExpedienteHeader';
import ExpedienteTabs from './ExpedienteTabs';
import ExpedienteSystemID from './ExpedienteSystemID';
import FiscalInfoSection from './FiscalInfoSection';
import OwnerInfoSection from './OwnerInfoSection';
import ExpedienteFooter from './ExpedienteFooter';
import BitacoraTab from './BitacoraTab';
import storeService from '../../../services/storeService';
import { StoreIdentityV3 } from '../../../models/store';

interface Props {
  open: boolean;
  onClose: () => void;
  tienda: any; // Can be typed properly if needed
}

const ExpedienteModal: React.FC<Props> = ({ open, onClose, tienda }) => {
  const [activeTab, setActiveTab] = useState<'ficha' | 'bitacora'>('ficha');
  const [identity, setIdentity] = useState<StoreIdentityV3 | null>(null);
  const [sellerStatus, setSellerStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open && tienda?.id) {
      const fetchIdentity = async () => {
        try {
          setLoading(true);
          const data = await storeService.getStoreIdentity(tienda.id);
          setIdentity(data);
          if (data?.store_portal_id) {
            try {
              const sellerData = await storeService.getSellerInfo(data.store_portal_id);
              setSellerStatus(sellerData?.status ?? null);
            } catch (err) {
              console.error('Error fetching seller status:', err);
              setSellerStatus(null);
            }
          }
          else {
            setSellerStatus(false);
          }
        } catch (error) {
          console.error('Error fetching store identity:', error);
          setIdentity(null);
        } finally {
          setLoading(false);
        }
      };
      fetchIdentity();
    } else {
      setIdentity(null);
      setSellerStatus(null);
      setActiveTab('ficha');
    }
  }, [open, tienda?.id]);

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
      <ExpedienteHeader title={identity?.store_name || tienda.name} onClose={onClose} />
      <ExpedienteTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <DialogContent sx={{ p: 0 }}>
        {activeTab === 'ficha' ? (
          <div className="animate-in fade-in duration-300 relative min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <CircularProgress size={32} sx={{ color: '#db3b2b' }} />
              </div>
            ) : null}

            <ExpedienteSystemID
              idt1={identity?.id_seller?.toString() || tienda.id.toString()}
              store_portal_id={identity?.store_portal_id?.toString() || tienda.id.toString()}
              legacy_finance_id={identity?.legacy_finance_id || ""}
              portalStatus={sellerStatus}
            />

            <FiscalInfoSection
              razonSocial={identity?.tax_information?.business_name || identity?.store_name || tienda.name}
              rfc={identity?.tax_information?.rfc || "EN TRÁMITE"}
              regimenFiscal={identity?.tax_information?.regime || "601 - G. LEY PERSONAS MORALES"}
              direccion={
                identity?.tax_information?.address
                  ? `${identity.tax_information.address.street} ${identity.tax_information.address.outer_number}, ${identity.tax_information.address.suburb}, ${identity.tax_information.address.town}, ${identity.tax_information.address.state}, CP ${identity.tax_information.address.zip}`
                  : "DIRECCIÓN NO REGISTRADA"
              }
            />

            <OwnerInfoSection
              nombre={identity?.contact?.name || identity?.store_name || "DANIEL GARCIA"}
              email={identity?.contact?.email || identity?.email_owner || "PRUEBA@CLARO.COM"}
              tel={identity?.contact?.phone || "5534277789"}
            />

            <ExpedienteFooter
              searsMultilateralId={identity?.contracts?.SR?.sign_signer?.[0]?.multilateral_id}
              sanbornsMultilateralId={identity?.contracts?.SN?.sign_signer?.[0]?.multilateral_id}
              onSears={async (id) => {
                try {
                  const blob = await storeService.getContractPdf(id);
                  const url = window.URL.createObjectURL(blob);
                  window.open(url, '_blank');
                } catch (err) {
                  console.error('Error opening Sears contract:', err);
                }
              }}
              onSanborns={async (id) => {
                try {
                  const blob = await storeService.getContractPdf(id);
                  const url = window.URL.createObjectURL(blob);
                  window.open(url, '_blank');
                } catch (err) {
                  console.error('Error opening Sanborns contract:', err);
                }
              }}
              onClose={onClose}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <BitacoraTab storeId={tienda.id} />
            <div className="px-6 pb-6 flex justify-end">
              <button
                onClick={onClose}
                className="bg-[#111827] text-white-2 px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
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
