import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const data = await authService.login(email, password);
			const token = data.access_token || data.token;
			if (token) {
				localStorage.setItem('jwt', token);
				navigate('/dashboard');
			} else {
				throw new Error(data.message || 'No token received');
			}
		} catch (err: any) {
			setError(err.message || 'Authentication failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center  relative overflow-hidden">

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-10"
			>

				<h1 className='text-2xl font-bold text-red-600 text-center'>T1</h1>

				<form onSubmit={handleLogin} className="space-y-6">
					{error && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center"
						>
							{error}
						</motion.div>
					)}

					<div className="space-y-2">
						<label className="text-sm font-medium text-black/70 ml-1">Correo</label>
						<div className="relative group">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="admin@example.com"
								className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-black placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-black/70 ml-1">Constraseña</label>
						<div className="relative group">
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="••••••••"
								className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-black placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full px-4 py-2 rounded btn-primary text-white-2 from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-black font-semibold py-4 rounded-xl shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{loading ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							'Sign In'
						)}
					</button>
				</form>
			</motion.div>
		</div>
	);
};

export default Login;
