import React from 'react';
import { Dialog, DialogContent, MenuItem, Select, FormControl, CircularProgress } from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';
import storeService from '../../services/storeService';

interface Props {
  open: boolean;
  onClose: () => void;
  tiendaName: string;
  storeId: string | number;
}

const SOPORTE_EMAILS = [
  'soporte@t1envios.com',
  'sistemas@t1.com',
  'admin@t1.com',
  'sistemas_t1comercios@t1comercios.com'
];

const AsignarSoporteModal: React.FC<Props> = ({ open, onClose, tiendaName, storeId }) => {
  const [selectedEmail, setSelectedEmail] = React.useState(SOPORTE_EMAILS[0]);
  const [comentario, setComentario] = React.useState('Solicitud de alta');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; message: string } | null>(null);

  const handleClose = () => {
    // Reset state on close
    setResult(null);
    setComentario('Solicitud de alta');
    setSelectedEmail(SOPORTE_EMAILS[0]);
    onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    setResult(null);

    const [assignResult, ghostResult] = await Promise.allSettled([
      storeService.createAssignment({
        email: selectedEmail,
        id_store: String(storeId),
        comentario,
        image_url: 'https://placeholder.example.com/imagen.jpg', // URL ficticia por ahora
        autorizado: false,
      }),
      storeService.addUserSystemGhost(storeId, selectedEmail),
    ]);

    setLoading(false);

    const errors: string[] = [];
    if (assignResult.status === 'rejected') {
      errors.push(`Asignación: ${assignResult.reason?.message || 'Error desconocido'}`);
    }
    if (ghostResult.status === 'rejected') {
      errors.push(`Ghost: ${ghostResult.reason?.message || 'Error desconocido'}`);
    }

    if (errors.length === 0) {
      setResult({ ok: true, message: 'Asignación y usuario ghost creados correctamente.' });
    } else {
      setResult({ ok: false, message: errors.join(' | ') });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          width: '100%',
          maxWidth: '450px',
          borderTop: '4px solid #db3b2b',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogContent sx={{ p: 6, textAlign: 'center' }}>
        <h2 className="text-2xl font-black italic text-[#1e293b] tracking-tight mb-1 uppercase">
          ASIGNAR TIENDA
        </h2>
        <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em] mb-8">
          GESTIÓN DE SOPORTE ADMINISTRATIVO - {tiendaName}
        </p>

        {/* Feedback result */}
        {result && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-6 text-sm font-semibold text-left ${result.ok
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-[#db3b2b] border border-red-100'
              }`}
          >
            {result.ok
              ? <CheckCircle size={18} className="shrink-0 text-emerald-500" />
              : <XCircle size={18} className="shrink-0 text-[#db3b2b]" />
            }
            {result.message}
          </div>
        )}

        {/* Email selector */}
        <div className="mb-4">
          <FormControl fullWidth>
            <Select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              disabled={loading || result?.ok}
              sx={{
                height: '54px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#db3b2b',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#db3b2b',
                  borderWidth: '1px'
                },
                '& .MuiSelect-select': {
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#475569',
                  textAlign: 'left',
                  px: 3
                }
              }}
            >
              {SOPORTE_EMAILS.map(email => (
                <MenuItem key={email} value={email}>{email}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Comentario */}
        <div className="mb-8">
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            disabled={loading || result?.ok}
            rows={2}
            placeholder="Comentario..."
            className="w-full px-4 py-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-sm font-medium text-[#475569] resize-none focus:outline-none focus:border-[#db3b2b] transition-colors disabled:opacity-50"
          />
        </div>

        {result?.ok ? (
          <button
            onClick={handleClose}
            className="w-full bg-emerald-500 text-white py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 mb-6"
          >
            CERRAR
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-[#db3b2b] text-white py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-[#c43527] transition-all shadow-lg shadow-red-500/20 mb-6 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ color: 'white' }} />
                GUARDANDO...
              </>
            ) : (
              'CONFIRMAR ASIGNACIÓN'
            )}
          </button>
        )}

        <button
          onClick={handleClose}
          className="text-[#94a3b8] text-[10px] font-black uppercase tracking-widest border-b border-[#cbd5e1] hover:text-[#475569] transition-colors"
        >
          CANCELAR
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default AsignarSoporteModal;
