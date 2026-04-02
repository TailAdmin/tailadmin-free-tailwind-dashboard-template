import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Alert, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, IconButton, Skeleton } from '@mui/material';
import { X } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import type { User } from '../models/user';
import userService from '../services/userService';
import { getUserRole } from '../utils/auth';
import CreateUser from './CreateUser';

interface UserRow {
	id: string;
	name: string;
	email: string;
	role: string;
	phone: string;
	createdAt: string;
	_disabled: boolean;
}

const UsersList: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isCollapsed } = useOutletContext<{ isCollapsed: boolean }>();

	const [editOpen, setEditOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
	const [editEmail, setEditEmail] = useState('');
	const [editRole, setEditRole] = useState('');
	const [editPhone, setEditPhone] = useState('');
	const [editLoading, setEditLoading] = useState(false);

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmId, setConfirmId] = useState<string | null>(null);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const [open, setOpen] = useState(false);
	const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
		open: false, message: '', severity: 'success'
	});

	const currentRole = getUserRole();
	const roleLabels: Record<string, string> = {
		SECONDARY_USER: 'Usuario secundario',
		SUPER_USER: 'Super usuario',
		ADMIN: 'Administrador',
	};

	const allowedRoles = currentRole === 'SUPER_USER'
		? ['SUPER_USER', 'SECONDARY_USER', 'ADMIN']
		: ['SECONDARY_USER', 'ADMIN'];

	useEffect(() => {
		const timer = setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 300);
		return () => clearTimeout(timer);
	}, [isCollapsed]);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await userService.getUsers();
				setUsers(data || []);
			} catch (e: any) {
				setError(e.message || 'Error cargando usuarios');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	// Handlers de Usuario
	const handleUserCreated = (user: User) => {
		setUsers((prev) => [user, ...prev]);
		setSnack({ open: true, message: 'Usuario creado correctamente', severity: 'success' });
		setTimeout(() => setOpen(false), 1200);
	};

	const handleOpenEdit = (id: string) => {
		const u = users.find((x) => String(x.id) === String(id));
		if (!u) return;
		setEditingId(id);
		setEditName(u.name);
		setEditEmail(u.email);
		setEditRole(u.role);
		setEditPhone(u.phone || '');
		setEditOpen(true);
	};

	const handleSubmitEdit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!editingId) return;
		setEditLoading(true);
		try {
			const payload = { name: editName, email: editEmail, role: editRole, phone: editPhone };
			const updated = await userService.updateUser(editingId, payload);
			setUsers((prev) => prev.map((p) => (String(p.id) === String(editingId) ? { ...p, ...updated } : p)));
			setSnack({ open: true, message: 'Usuario actualizado', severity: 'success' });
			setEditOpen(false);
		} catch (err: any) {
			setSnack({ open: true, message: err?.message || 'Error actualizando', severity: 'error' });
		} finally {
			setEditLoading(false);
		}
	};

	const handleConfirmDelete = async () => {
		if (!confirmId) return;
		setConfirmLoading(true);
		try {
			await userService.deleteUser(confirmId);
			setUsers((prev) => prev.filter((p) => String(p.id) !== String(confirmId)));
			setSnack({ open: true, message: 'Usuario eliminado', severity: 'success' });
			setConfirmOpen(false);
		} catch (err: any) {
			setSnack({ open: true, message: err?.message || 'Error eliminando usuario', severity: 'error' });
		} finally {
			setConfirmLoading(false);
		}
	};

	// Transformación de datos para el Grid
	const rows: UserRow[] = users.map((u, idx) => ({
		id: u.id ? String(u.id) : String(idx + 1),
		name: u.name,
		email: u.email,
		role: u.disabled ? 'Deshabilitado' : (roleLabels[u.role] || u.role),
		phone: u.phone || '',
		createdAt: u.createdAt ? new Date(u.createdAt).toLocaleString() : '-',
		_disabled: Boolean(u.disabled),
	}));

	// Definición de Columnas
	const columns: GridColDef<UserRow>[] = [
		{ field: 'id', headerName: 'ID', width: 10 },
		{ field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
		{ field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
		{ field: 'role', headerName: 'Rol', width: 160 },
		{
			field: 'phone',
			headerName: 'Teléfono',
			width: 150,
			valueFormatter: (value: string) => {
				if (!value) return '-';
				const clean = value.replace(/\D/g, '');
				// Formato México con código de país (52 + 10 dígitos)
				if (clean.length === 12 && clean.startsWith('52')) {
					return `+52 (${clean.slice(2, 4)}) ${clean.slice(4, 8)}-${clean.slice(8)}`;
				}
				// Formato 10 dígitos estándar
				if (clean.length === 10) {
					return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
				}
				return value.startsWith('+') ? value : `+${value}`;
			},
		},
		{ field: 'createdAt', headerName: 'Creado', width: 160 },
		{
			field: 'actions',
			headerName: 'Acciones',
			width: 160,
			sortable: false,
			renderCell: (params: GridRenderCellParams<UserRow>) => (
				<div className="flex items-center gap-2 h-full">
					<button
						onClick={() => handleOpenEdit(params.row.id)}
						className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
					>
						Actualizar
					</button>
					<button
						onClick={() => { setConfirmId(params.row.id); setConfirmOpen(true); }}
						className={`px-3 py-1.5 text-xs font-medium rounded-lg text-white-2 transition-opacity hover:opacity-90 ${params.row._disabled ? 'bg-emerald-500' : 'bg-red-500'
							}`}
					>
						{params.row._disabled ? 'Habilitar' : 'Deshabilitar'}
					</button>
				</div>
			),
		},
	];

	return (
		<div className="p-8">
			<h2 className="text-2xl font-bold mb-6">Usuarios</h2>
			<div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
				<div className="flex items-center justify-end mb-4">
					<button
						onClick={() => setOpen(true)}
						className="px-6 py-2 rounded-xl btn-primary text-white-2 text-sm font-semibold transition-all hover:scale-[1.02]"
					>
						Crear usuario
					</button>
				</div>

				{loading ? (
					<div className="space-y-4">
						<Skeleton variant="rectangular" height={50} className="rounded-xl bg-white/5" />
						{[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={45} className="rounded-lg bg-white/5" />)}
					</div>
				) : error ? (
					<Alert severity="error" className="rounded-xl">{error}</Alert>
				) : (
					<div style={{ height: 550, width: '100%' }}>
						<DataGrid
							rows={rows}
							columns={columns}
							pageSizeOptions={[10, 25, 50]}
							initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
							disableRowSelectionOnClick
							sx={{
								border: 'none',
								'& .MuiDataGrid-cell': { color: 'inherit', borderBottom: '1px solid rgba(255,255,255,0.05)' },
								'& .MuiDataGrid-columnHeaders': { backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.1)' },
							}}
						/>
					</div>
				)}
			</div>

			{/* Modal Crear */}
			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: '18px' } }}>
				<IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 16, top: 16 }}><X size={20} /></IconButton>
				<DialogTitle>Crear usuario</DialogTitle>
				<DialogContent><CreateUser onCreated={handleUserCreated} /></DialogContent>
			</Dialog>

			{/* Modal Editar */}
			<Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '18px' } }}>
				<IconButton onClick={() => setEditOpen(false)} sx={{ position: 'absolute', right: 16, top: 16 }}><X size={20} /></IconButton>
				<DialogTitle>Actualizar usuario</DialogTitle>
				<DialogContent>
					<form id="edit-form" onSubmit={handleSubmitEdit} className="space-y-4 mt-4">
						<input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nombre" className="w-full p-2 rounded bg-gray-50 border" required />
						<input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded bg-gray-50 border" required />
						<select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full p-2 rounded bg-gray-50 border">
							{allowedRoles.map(r => <option key={r} value={r}>{roleLabels[r] || r}</option>)}
						</select>
						<div className="phone-wrapper">
							<label className="text-xs text-gray-500 mb-1 block">Teléfono Internacional</label>
							<PhoneInput country={'mx'} value={editPhone} onChange={setEditPhone} inputStyle={{ width: '100%' }} />
						</div>
					</form>
				</DialogContent>
				<DialogActions sx={{ p: 3 }}>
					<button type="submit" form="edit-form" disabled={editLoading} className="px-6 py-2 rounded-xl btn-primary text-white-2 font-semibold">
						{editLoading ? 'Guardando...' : 'Guardar Cambios'}
					</button>
				</DialogActions>
			</Dialog>

			{/* Confirmación Eliminar */}
			<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: '18px' } }}>
				<DialogTitle>¿Eliminar usuario?</DialogTitle>
				<DialogContent><p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p></DialogContent>
				<DialogActions sx={{ p: 3 }}>
					<button onClick={() => setConfirmOpen(false)} className="px-4 py-2">Cancelar</button>
					<button onClick={handleConfirmDelete} disabled={confirmLoading} className="px-6 py-2 bg-red-500 text-white-2 rounded-xl">
						{confirmLoading ? 'Eliminando...' : 'Eliminar'}
					</button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snack.open}
				autoHideDuration={3000}
				onClose={() => setSnack(s => ({ ...s, open: false }))}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					severity={snack.severity}
					onClose={() => setSnack(s => ({ ...s, open: false }))}
					sx={{ width: '100%', borderRadius: '12px' }}
				>
					{snack.message}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default UsersList;