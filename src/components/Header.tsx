import React from 'react';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
	return (
		<header className="w-full flex items-center justify-between mb-6">
			<div className="flex items-center gap-4">
				<div className="inline-flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))` }}>
						<span className="font-bold text-white">T1</span>
					</div>
					<div>
						<div className="text-lg font-bold">T1 tienda</div>
						<div className="text-sm text-muted">Llantas Cavazos Shop</div>
					</div>
				</div>
			</div>

			<div className="flex-1 px-6">
				<div className="max-w-2xl mx-auto relative">
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Search size={16} /></div>
					<input placeholder="Búsqueda" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200" />
				</div>
			</div>

			<div className="flex items-center gap-3">
				<button className="px-4 py-2 rounded border border-gray-200">Exportar</button>
				<button className="px-4 py-2 rounded btn-primary">Guardar</button>
			</div>
		</header>
	);
};

export default Header;
