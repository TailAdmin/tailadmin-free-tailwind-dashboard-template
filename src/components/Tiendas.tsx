import React, { useState } from 'react';
import { MoreVertical, ChevronDown, Edit2, UserCheck } from 'lucide-react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

interface Tienda {
    id: string;
    idt1: string;
    nombre: string;
    asignacion: string | null;
}

const Tiendas: React.FC = () => {
    const [tiendas] = useState<Tienda[]>([
        { id: '1', idt1: '210708', nombre: 'TRINITY', asignacion: 'soporte@t1envios.com' },
        { id: '2', idt1: '10703', nombre: 'SALVAJE TENTACIÓN', asignacion: null },
        { id: '3', idt1: '32668', nombre: 'ANANTEJOYERÍA', asignacion: 'sistemas@t1.com' },
        { id: '4', idt1: '20559', nombre: 'ONKY', asignacion: null },
        { id: '5', idt1: '10315', nombre: 'TU MEJOR OPCION', asignacion: null },
        { id: '6', idt1: '45612', nombre: 'TIENDA TEST 1', asignacion: 'test1@t1.com' },
        { id: '7', idt1: '78945', nombre: 'TIENDA TEST 2', asignacion: null },
        { id: '8', idt1: '12354', nombre: 'TIENDA TEST 3', asignacion: 'test3@t1.com' },
        { id: '9', idt1: '55667', nombre: 'TIENDA TEST 4', asignacion: null },
        { id: '10', idt1: '22334', nombre: 'TIENDA TEST 5', asignacion: null },
        { id: '11', idt1: '99887', nombre: 'TIENDA TEST 6', asignacion: 'test6@t1.com' },
    ]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, _id: string) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const columns: GridColDef<Tienda>[] = [
        {
            field: 'idt1',
            headerName: 'IDT1',
            width: 150,
        },
        {
            field: 'nombre',
            headerName: 'TIENDA',
            flex: 1,
        },
        {
            field: 'asignacion',
            headerName: 'ASIGNACIÓN',
            flex: 1.5,
        },
        {
            field: 'actions',
            headerName: 'ACCIONES',
            width: 100,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params: GridRenderCellParams<Tienda>) => (
                <div className="pr-2">
                    <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, params.row.id)}
                        sx={{ color: '#e5e7eb' }}
                        className="hover:bg-gray-100 transition-colors"
                    >
                        <MoreVertical size={20} />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Search Bar Section */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-lg sm:min-w-[140px] bg-white">
                    <span className="text-sm font-semibold text-gray-800">Nombre</span>
                    <ChevronDown size={14} className="text-gray-400 ml-auto" />
                </div>
                <div className="flex-1 relative sm:border-l border-gray-100 sm:pl-4 ml-0">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full py-2 bg-transparent border-none focus:ring-0 text-sm text-gray-400 font-medium outline-none"
                    />
                </div>
                <button className="bg-[#db3b2b] text-white-2 px-10 py-2 sm:py-1.5 rounded-lg font-bold text-sm tracking-widest hover:bg-[#c43527] transition-all hover:shadow-lg uppercase w-full sm:w-auto">
                    BUSCAR
                </button>
                <div className="sm:pl-4 text-center sm:text-left pt-2 sm:pt-0 border-t sm:border-none border-gray-50">
                    <button className="text-gray-300 text-[10px] font-bold hover:text-gray-500 transition-colors uppercase tracking-widest whitespace-nowrap">
                        VER TODAS
                    </button>
                </div>
            </div>

            {/* Table Section (MUI Data Grid) */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden p-2">
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={tiendas}
                        columns={columns}
                        disableRowSelectionOnClick
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                        rowHeight={80}
                    />
                </div>
            </div>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <ListItemIcon><Edit2 size={18} className="text-blue-500" /></ListItemIcon>
                    <ListItemText primary="Editar Tienda" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon><UserCheck size={18} className="text-emerald-500" /></ListItemIcon>
                    <ListItemText primary="Asignar" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>
            </Menu>
        </div>
    );
};

export default Tiendas;
