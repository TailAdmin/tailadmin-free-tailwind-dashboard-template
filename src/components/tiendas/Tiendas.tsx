import React, { useState } from 'react';
import { MoreVertical, ChevronDown, Eye, UserPlus, UserMinus } from 'lucide-react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import ExpedienteModal from './expediente/ExpedienteModal';
import AsignarSoporteModal from './AsignarSoporteModal';

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
    const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
    const [searchCategory, setSearchCategory] = useState<'Nombre' | 'IDT1'>('Nombre');
    
    // Expediente Modal State
    const [expedienteOpen, setExpedienteOpen] = useState(false);
    const [selectedTienda, setSelectedTienda] = useState<Tienda | null>(null);
    const [selectedTiendaId, setSelectedTiendaId] = useState<string | null>(null);
    
    // Asignar Soporte Modal State
    const [assignOpen, setAssignOpen] = useState(false);



    const menuOpen = Boolean(anchorEl);
    const categoryMenuOpen = Boolean(categoryAnchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedTiendaId(id);
    };

    const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
        setCategoryAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCategoryClose = (category?: 'Nombre' | 'IDT1') => {
        if (category) setSearchCategory(category);
        setCategoryAnchorEl(null);
    };


    const columns: GridColDef<Tienda>[] = [
        {
            field: 'idt1',
            headerName: 'IDT1',
            width: 150,
            renderCell: (params: GridRenderCellParams<Tienda>) => (
                <span className="font-extrabold text-[#db3b2b] text-base">{params.value}</span>
            )
        },
        {
            field: 'nombre',
            headerName: 'TIENDA',
            flex: 1,
            renderCell: (params: GridRenderCellParams<Tienda>) => (
                <span className="font-extrabold text-gray-800 uppercase text-sm tracking-tight">{params.value}</span>
            )
        },
        {
            field: 'asignacion',
            headerName: 'ASIGNACIÓN',
            flex: 1.5,
            renderCell: (params: GridRenderCellParams<Tienda>) => (
                params.value ? (
                    <div className="flex items-center gap-2">
                        <span className="w-[1.5px] h-4 bg-[#db3b2b] inline-block" />
                        <span className="text-sm font-semibold text-gray-700">{params.value}</span>
                    </div>
                ) : (
                    <span className="text-gray-300 text-sm font-medium italic">Sin asignar</span>
                )
            )
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
                        sx={{ color: '#db3b2b' }}
                        className="hover:bg-gray-50 transition-colors"
                    >
                        <MoreVertical size={20} />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Search Bar Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border border-gray-50">
                <div className="flex-1 flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-white">
                    <div
                        onClick={handleCategoryClick}
                        className="flex items-center gap-2 px-4 py-2 min-w-[140px] bg-white border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm font-bold text-gray-800">{searchCategory}</span>
                        <ChevronDown size={14} className="text-gray-400 ml-auto" />
                    </div>
                    <Menu
                        anchorEl={categoryAnchorEl}
                        open={categoryMenuOpen}
                        onClose={() => handleCategoryClose()}
                        disableScrollLock
                        PaperProps={{
                            sx: {
                                borderRadius: '10px',
                                mt: 0.5,
                                minWidth: '140px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                border: '1px solid #f1f1f1',
                                '& .MuiList-root': {
                                    p: 0,
                                },
                                '& .MuiMenuItem-root': {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#4b5563',
                                    py: 1.5,
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: '#f9fafb',
                                        color: '#db3b2b',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#f3f4f6',
                                        color: '#db3b2b',
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem onClick={() => handleCategoryClose('Nombre')} selected={searchCategory === 'Nombre'}>Nombre</MenuItem>
                        <MenuItem onClick={() => handleCategoryClose('IDT1')} selected={searchCategory === 'IDT1'}>IDT1</MenuItem>
                    </Menu>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="flex-1 px-4 py-2 bg-transparent !border-none !shadow-none !ring-0 !outline-none text-sm text-gray-400 font-medium"
                    />
                </div>
                <button className="bg-[#db3b2b] text-white-2 px-10 h-11 rounded-lg font-extrabold text-sm tracking-[0.1em] hover:bg-[#c43527] transition-all hover:shadow-lg uppercase whitespace-nowrap">
                    BUSCAR
                </button>
                <div className="pl-2">
                    <button className="text-[#c1c1c1] text-[11px] font-bold hover:text-gray-500 transition-colors uppercase tracking-[0.2em] whitespace-nowrap">
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
                        rowHeight={84}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'white',
                                color: '#a3a3a3',
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                borderBottom: '1px solid #f3f4f6',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f9fafb',
                                display: 'flex',
                                alignItems: 'center',
                            },
                            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                outline: 'none !important',
                            },
                            '& .MuiDataGrid-columnSeparator': {
                                display: 'none',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#fafafa',
                            },
                        }}
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
                disableScrollLock
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        mt: 0.5,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid #f1f1f1',
                        '& .MuiList-root': {
                            py: 0.5,
                        }
                    }
                }}
            >
                <MenuItem onClick={() => {
                    const t = tiendas.find(x => x.id === selectedTiendaId);
                    if (t) {
                        setSelectedTienda(t);
                        setExpedienteOpen(true);
                    }
                    handleClose();
                }} sx={{ py: 1.5, px: 3 }}>
                    <ListItemIcon sx={{ minWidth: '36px !important' }}>
                        <Eye size={18} className="text-[#db3b2b]" />
                    </ListItemIcon>
                    <ListItemText
                        primary="VER EXPEDIENTE"
                        primaryTypographyProps={{
                            variant: 'caption',
                            fontWeight: 800,
                            color: '#db3b2b',
                            letterSpacing: '0.05em'
                        }}
                    />
                </MenuItem>

                <div className="mx-3 border-t border-gray-50 my-0.5" />

                <MenuItem onClick={() => {
                    const t = tiendas.find(x => x.id === selectedTiendaId);
                    if (t) {
                        setSelectedTienda(t);
                        setAssignOpen(true);
                    }
                    handleClose();
                }} sx={{ py: 1.5, px: 3 }}>
                    <ListItemIcon sx={{ minWidth: '36px !important' }}>
                        <UserPlus size={18} className="text-[#10b981]" />
                    </ListItemIcon>
                    <ListItemText
                        primary="ASIGNAR SOPORTE"
                        primaryTypographyProps={{
                            variant: 'caption',
                            fontWeight: 800,
                            color: '#10b981',
                            letterSpacing: '0.05em'
                        }}
                    />
                </MenuItem>

                <div className="mx-3 border-t border-gray-50 my-0.5" />

                <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 3 }}>
                    <ListItemIcon sx={{ minWidth: '36px !important' }}>
                        <UserMinus size={18} className="text-[#db3b2b]" />
                    </ListItemIcon>
                    <ListItemText
                        primary="QUITAR ASIGNACIÓN"
                        primaryTypographyProps={{
                            variant: 'caption',
                            fontWeight: 800,
                            color: '#db3b2b',
                            letterSpacing: '0.05em'
                        }}
                    />
                </MenuItem>
            </Menu>

            <ExpedienteModal 
                open={expedienteOpen} 
                onClose={() => setExpedienteOpen(false)} 
                tienda={selectedTienda}
            />

            <AsignarSoporteModal
                open={assignOpen}
                onClose={() => setAssignOpen(false)}
                tiendaName={selectedTienda?.nombre || ''}
            />
        </div>
    );
};

export default Tiendas;
