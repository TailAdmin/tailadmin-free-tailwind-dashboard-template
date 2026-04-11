import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Menu, X, Store } from 'lucide-react';
import auth, { getUserRole } from '../utils/auth';
import { UserRole } from '../models/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'

const Dashboard: React.FC = () => {
	const location = useLocation();
	const userRole = getUserRole();
	const isAdmin = userRole === UserRole.SUPER_USER;

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleSidebar = () => {
		if (window.innerWidth >= 1024) {
			setIsCollapsed(!isCollapsed);
		} else {
			setSidebarOpen(!sidebarOpen);
		}
	};

	return (
		<div className="flex h-screen  overflow-hidden">
			<aside
				className={`fixed lg:static top-0 left-0 h-full z-40 transform transition-all duration-300 bg-[var(--sidebar-bg)] border-r border-gray-200 flex flex-col p-4 lg:p-6 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'
					} w-3/4 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
			>
				<div className={`flex items-center gap-3 mb-10 ${isCollapsed ? 'lg:justify-center' : ''}`}>
					<div className="w-10 h-10 min-w-[40px] flex items-center justify-center">
						<h1 className="text-3xl font-black text-[#db3b2b] m-0 leading-none tracking-tight">T1</h1>
					</div>
					{!isCollapsed && (
						<motion.span
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							className="text-xl font-bold tracking-tight whitespace-nowrap lg:block hidden"
						>
						</motion.span>
					)}
				</div>

				<nav className="flex-1 space-y-2 overflow-x-hidden">
					<SidebarItem
						icon={<Store size={20} />}
						label="Tiendas"
						to="/dashboard/tiendas"
						active={location.pathname === '/dashboard/tiendas' || location.pathname === '/dashboard'}
						isCollapsed={isCollapsed}
					/>
					{isAdmin && (
						<>
							<SidebarItem
								icon={<FontAwesomeIcon icon={faUserPlus} style={{ fontSize: '20px' }} />}
								label="Agregar Usuario"
								to="/dashboard/users"
								active={location.pathname === '/dashboard/users'}
								isCollapsed={isCollapsed}
							/>
						</>
					)}
					<SidebarItem
						icon={<FontAwesomeIcon icon={faUser} style={{ fontSize: '20px' }} />}
						label="Perfil"
						to="/dashboard/profile"
						active={location.pathname === '/dashboard/profile'}
						isCollapsed={isCollapsed}
					/>
				</nav>

				<button
					onClick={() => auth.logout()}
					className={`mt-auto flex items-center gap-3 p-3 rounded-xl btn-primary transition-all group overflow-hidden ${isCollapsed ? 'lg:justify-center' : 'lg:justify-start'}`}
				>
					<LogOut size={20} className="group-hover:translate-x-1 transition-transform min-w-[20px]" />
					{!isCollapsed && (
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="font-semibold whitespace-nowrap lg:block hidden"
						>
							Salir
						</motion.span>
					)}
					<span className="font-semibold lg:hidden">Logout</span>
				</button>
			</aside>

			<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
				<button
					onClick={toggleSidebar}
					className="absolute left-1 top-4 p-2 rounded-md bg-white border border-gray-100 z-50 transition-all hover:bg-gray-50 text-[#db3b2b] shadow-sm"
					aria-label="Toggle sidebar"
				>
					{(sidebarOpen || (window.innerWidth >= 1024 && !isCollapsed)) ? <X size={18} /> : <Menu size={18} />}
				</button>
				<div className="w-full">
					<div className="space-y-6">
						<div className="panel overflow-hidden">
							<Outlet context={{ isCollapsed }} />
						</div>
					</div>
				</div>
			</main>
			{sidebarOpen && (
				<div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 30 }} />
			)}
		</div>
	);
};

const SidebarItem = ({ icon, label, active = false, to, isCollapsed }: any) => {
	const base = `flex items-center gap-3 p-3 rounded-xl transition-all overflow-hidden ${isCollapsed ? 'lg:justify-center' : 'lg:justify-start'}`;
	const activeStyle: any = active
		? { backgroundColor: 'rgba(var(--brand-primary-rgb),0.08)', color: 'var(--brand-primary)', border: '1px solid rgba(var(--brand-primary-rgb),0.12)' }
		: { color: 'var(--text-muted)' };

	const content = (
		<>
			<div className="min-w-[20px]">{icon}</div>
			{!isCollapsed && (
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="font-semibold whitespace-nowrap lg:block hidden"
				>
					{label}
				</motion.span>
			)}
			<span className="font-semibold lg:hidden">{label}</span>
		</>
	);

	if (to) {
		return (
			<Link to={to} className={base} style={activeStyle}>
				{content}
			</Link>
		);
	}

	return (
		<a href="#" className={base} style={activeStyle}>
			{content}
		</a>
	);
};

export default Dashboard;
