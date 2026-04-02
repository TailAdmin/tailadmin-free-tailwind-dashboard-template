import React, { useState } from 'react';
import { validateUserForm } from '../utils/validation';
import { createUser } from '../services/userService';
import { getUserRole } from '../utils/auth';
import type { User, CreateUserPayload } from '../models/user';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

type Props = {
	onCreated?: (user: User) => void;
};

const CreateUser: React.FC<Props> = ({ onCreated }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('SECONDARY_USER');
	const [phone, setPhone] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const currentRole = getUserRole();

	const roleLabels: Record<string, string> = {
		SECONDARY_USER: 'Usuario secundario',
		SUPER_USER: 'Super usuario',
		ADMIN: 'Administrador',
	};

	const allowedRoles = currentRole === 'SUPER_USER' ? ['SUPER_USER', 'SECONDARY_USER', 'ADMIN'] : ['SECONDARY_USER', 'ADMIN'];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		const { valid, errors: vErrors } = validateUserForm({ name, email, password, role, phone });
		if (!valid) {
			setErrors(vErrors);
			const first = Object.values(vErrors)[0];
			setMessage(first || 'Corrige los campos');
			setLoading(false);
			return;
		}
		setErrors({});
		try {
			const result = await createUser({ name, email, password, role, phone } as CreateUserPayload);
			setMessage('Usuario creado correctamente');
			setName('');
			setEmail('');
			setPassword('');
			setRole('SECONDARY_USER');
			setPhone('');
			setErrors({});
			if (onCreated) onCreated(result);
		} catch (error: any) {
			if (error && error.errors) {
				setErrors(error.errors);
				const first = Object.values(error.errors)[0] as any;
				setMessage(first || error.message || 'Error al crear usuario');
			} else {
				setMessage(error?.message || 'Error de red');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8">
			<h2 className="text-2xl font-bold mb-4">Crear nuevo usuario</h2>
			<form onSubmit={handleSubmit} className="space-y-4 max-w-md">
				<div>
					<label className="block text-sm font-medium mb-1">Nombre Completo</label>
					<input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" required />
					{errors.name && <div className="text-red-400 text-sm mt-1">{errors.name}</div>}
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Email</label>
					<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" required />
					{errors.email && <div className="text-red-400 text-sm mt-1">{errors.email}</div>}
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Contraseña</label>
					<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" required />
					{errors.password && <div className="text-red-400 text-sm mt-1">{errors.password}</div>}
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Rol</label>
					<select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10">
						{allowedRoles.map((r) => (
							<option key={r} value={r}>{roleLabels[r] || r}</option>
						))}
					</select>
					{currentRole !== 'SUPER_USER' && (
						<div className="text-xs text-white/40 mt-1">Solo Super usuario puede crear otro Super usuario.</div>
					)}
					{errors.role && <div className="text-red-400 text-sm mt-1">{errors.role}</div>}
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Teléfono</label>
					<PhoneInput
						country={'mx'}
						value={phone}
						onChange={val => setPhone(val)}
						containerClass="phone-input-container"
					/>
					{errors.phone && <div className="text-red-400 text-sm mt-1">{errors.phone}</div>}
				</div>
				<div>
					<button type="submit" disabled={loading} className="px-4 py-2 rounded btn-primary text-white-2">
						{loading ? 'Creando...' : 'Crear usuario'}
					</button>
				</div>
				{message && <div className="mt-2 text-sm">{message}</div>}
			</form>
		</div>
	);
};

export default CreateUser;
