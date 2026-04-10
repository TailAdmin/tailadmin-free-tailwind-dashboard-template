import React from 'react';
import { Dialog, DialogContent, MenuItem, Select, FormControl } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  tiendaName: string;
}

const AsignarSoporteModal: React.FC<Props> = ({ open, onClose, tiendaName }) => {
  const [selectedEmail, setSelectedEmail] = React.useState('soporte@t1envios.com');

  return (
    <Dialog
      open={open}
      onClose={onClose}
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

        <div className="mb-8">
          <FormControl fullWidth>
            <Select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
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
              <MenuItem value="soporte@t1envios.com">soporte@t1envios.com</MenuItem>
              <MenuItem value="sistemas@t1.com">sistemas@t1.com</MenuItem>
              <MenuItem value="admin@t1.com">admin@t1.com</MenuItem>
            </Select>
          </FormControl>
        </div>

        <button
          className="w-full bg-[#db3b2b] text-white-2 py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-[#c43527] transition-all shadow-lg shadow-red-500/20 mb-6"
        >
          CONFIRMAR ASIGNACIÓN
        </button>

        <button
          onClick={onClose}
          className="text-[#94a3b8] text-[10px] font-black uppercase tracking-widest border-b border-[#cbd5e1] hover:text-[#475569] transition-colors"
        >
          CANCELAR
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default AsignarSoporteModal;
