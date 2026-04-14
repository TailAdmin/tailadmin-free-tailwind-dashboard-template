import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import userService from '../services/userService';
import type { User } from '../models/user';
import 'react-phone-input-2/lib/style.css'

const Profile: React.FC = () => {
	const [, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Form states
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [updateLoading, setUpdateLoading] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await userService.getProfile();
				setUser(data);
				setName(data.name);
				setEmail(data.email);
				setPhone(data.phone || '');
			} catch (err: any) {
				setError(err.message || 'Error cargando el perfil');
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
		e.preventDefault();
		setUpdateLoading(true);
		setMessage(null);
		try {
			const payload = { name, email, phone };
			const updated = await userService.updateProfile(payload);
			console.log(updated);
			setUser(updated);
			setMessage({ text: 'Información personal actualizada correctamente', type: 'success' });
		} catch (err: any) {
			setMessage({ text: err.message || 'Error actualizando el perfil', type: 'error' });
		} finally {
			setUpdateLoading(false);
		}
	};

	const handleUpdatePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password) return;
		if (password !== confirmPassword) {
			setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
			return;
		}

		setPasswordLoading(true);
		setMessage(null);
		try {
			await userService.updateProfile({ password });
			setMessage({ text: 'Contraseña actualizada correctamente', type: 'success' });
			setPassword('');
			setConfirmPassword('');
		} catch (err: any) {
			setMessage({ text: err.message || 'Error actualizando la contraseña', type: 'error' });
		} finally {
			setPasswordLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="p-8 max-w-4xl">
				<Skeleton variant="text" width={200} height={40} className="mb-6 bg-white/5" />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Skeleton variant="rectangular" height={300} className="rounded-2xl bg-white/5" />
					<Skeleton variant="rectangular" height={250} className="rounded-2xl bg-white/5" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8">
				<div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl">
			<h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Información Personal */}
				<div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl">
					<h3 className="text-lg font-semibold mb-4">Información Personal</h3>
					<form onSubmit={handleUpdatePersonalInfo} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Nombre completo</label>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-brand-primary transition-all"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-brand-primary transition-all"
								required
							/>
						</div>
						<div className="pt-2">
							<button
								type="submit"
								disabled={updateLoading}
								className="px-4 py-2 rounded btn-primary text-white-2 font-medium disabled:opacity-50 transition-all"
							>
								{updateLoading ? 'Guardando...' : 'Actualizar Datos'}
							</button>
						</div>
					</form>
				</div>

				{/* Cambiar Contraseña */}
				<div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl">
					<h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
					<form onSubmit={handleUpdatePassword} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Nueva contraseña</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-brand-primary transition-all"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Confirmar nueva contraseña</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 focus:outline-none focus:border-brand-primary transition-all"
							/>
						</div>
						<div className="pt-2">
							<button
								type="submit"
								disabled={passwordLoading || !password}
								className="px-4 py-2 rounded btn-primary text-white-2 font-medium disabled:opacity-50 transition-all"
							>
								{passwordLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
							</button>
						</div>
					</form>
				</div>
			</div>

			{message && (
				<div className={`mt-6 p-4 rounded-xl border ${message.type === 'success'
					? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
					: 'bg-[#db3b2b]/10 border-[#db3b2b]/20 text-[#db3b2b]'
					}`}>
					{message.text}
				</div>
			)}
		</div>
	);
};

export default Profile;
