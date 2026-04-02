import { API_URL } from '../utils/auth';

export type LoginResponse = {
	access_token?: string;
	token?: string;
	[key: string]: any;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
	const res = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({ message: 'Error desconocido' }));
		const err: any = new Error(data.message || 'Error en login');
		throw err;
	}

	return res.json();
};

export default { login };
