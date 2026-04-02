import auth, { API_URL } from '../utils/auth';
import type { CreateUserPayload, User, APIError } from '../models/user';

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
	const res = await auth.fetch(`${API_URL}/users`, {
		method: 'POST',
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({ message: 'Error desconocido' }));
		const err: any = new Error(data.message || 'Error creando usuario');
		if ((data as APIError).errors) err.errors = (data as APIError).errors;
		throw err;
	}

	return res.json();
};

export const getUsers = async (): Promise<User[]> => {
	const res = await auth.fetch(`${API_URL}/users`, { method: 'GET' });

	if (!res.ok) {
		const data = await res.json().catch(() => ({ message: 'Error desconocido' }));
		const err: any = new Error(data.message || 'Error obteniendo usuarios');
		throw err;
	}

	return res.json();
};

export const updateUser = async (id: string, payload: Partial<CreateUserPayload>): Promise<User> => {
	const res = await auth.fetch(`${API_URL}/users/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({ message: 'Error desconocido' }));
		const err: any = new Error(data.message || 'Error actualizando usuario');
		if ((data as APIError).errors) err.errors = (data as APIError).errors;
		throw err;
	}

	return res.json();
};

export const deleteUser = async (id: string): Promise<void> => {
	const res = await auth.fetch(`${API_URL}/users/${id}`, {
		method: 'DELETE',
	});

	if (!res.ok) {
		const data = await res.json().catch(() => ({ message: 'Error desconocido' }));
		const err: any = new Error(data.message || 'Error eliminando usuario');
		throw err;
	}
};

export const getProfile = async (): Promise<User> => {
	const res = await auth.fetch(`${API_URL}/users/me`, { method: 'GET' });
	if (!res.ok) {
		const data = await res.json().catch(() => ({ message: 'Error desconocido' }));
		throw new Error(data.message || 'Error obteniendo perfil');
	}
	return res.json();
};

export const updateProfile = async (payload: any): Promise<User> => {
	const res = await auth.fetch(`${API_URL}/users/me`, {
		method: 'PATCH',
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({ message: 'Error desconocido' }));
		throw new Error(data.message || 'Error actualizando perfil');
	}
	return res.json();
};

export default { createUser, getUsers, updateUser, deleteUser, getProfile, updateProfile };
