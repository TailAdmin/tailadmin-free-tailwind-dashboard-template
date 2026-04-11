import auth, { API_URL } from '../utils/auth';
import type { Store, StoreInfo, StoreIdentityV3, ApiResponse, ApiListResponse } from '../models/store';
import type { Assignment } from '../models/assignment';

/**
 * Searches for stores by name or IDT1
 * Endpoint: GET /api/external/t1/store/find/:text
 */
export const findStores = async (query: string): Promise<Store[]> => {
  const cleanQuery = query.trim();
  const url = cleanQuery
    ? `${API_URL}/external/t1/store/find/${encodeURIComponent(cleanQuery)}`
    : `${API_URL}/external/t1/store/find`; // No trailing slash if empty

  const res = await auth.fetch(url, {
    method: 'GET',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error buscando tiendas' }));
    throw new Error(data.message || 'Error en la búsqueda');
  }

  const response: ApiListResponse<Store> = await res.json();
  return response.data || [];
};

/**
 * Gets basic information for a specific store
 * Endpoint: GET /api/external/t1/store/:id/getinfo
 */
export const getStoreInfo = async (storeId: number | string): Promise<StoreInfo> => {
  const res = await auth.fetch(`${API_URL}/external/t1/store/${storeId}/getinfo`, {
    method: 'GET',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error obteniendo info de tienda' }));
    throw new Error(data.message || 'Error obteniendo información');
  }

  const response: ApiResponse<StoreInfo> = await res.json();
  return response.data;
};

/**
 * Gets detailed identity information (v3) for a store
 * Endpoint: GET /api/external/t1/identity/v3/stores/:id
 */
export const getStoreIdentity = async (storeId: number | string): Promise<StoreIdentityV3> => {
  const res = await auth.fetch(`${API_URL}/external/t1/identity/v3/stores/${storeId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error obteniendo identidad v3' }));
    throw new Error(data.message || 'Error obteniendo identidad detallada');
  }

  const response: ApiResponse<StoreIdentityV3> = await res.json();
  return response.data;
};

/**
 * 17. Info vendedor (reemplaza <PORTAL_ID>)
 * Endpoint: GET /api/external/t1/sellers/:portalId
 */
export const getSellerInfo = async (portalId: string | number): Promise<any> => {
  const res = await auth.fetch(`${API_URL}/external/t1/sellers/${portalId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error obteniendo info del vendedor' }));
    throw new Error(data.message || 'Error obteniendo información del vendedor');
  }

  const response: ApiResponse<any> = await res.json();
  return response.data;
};

/**
 * 18. Get contract PDF from Seguridata
 * Endpoint: GET /api/external/t1/seguridata/multilateral/finalize/:id/false/pdf
 */
export const getContractPdf = async (multilateralId: number | string): Promise<Blob> => {
  const res = await auth.fetch(`${API_URL}/external/t1/seguridata/multilateral/finalize/${multilateralId}/false/pdf`, {
    method: 'GET',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error obteniendo PDF del contrato' }));
    throw new Error(data.message || 'Error obteniendo PDF del contrato');
  }

  return await res.blob();
};

export interface AssignmentPayload {
  email: string;
  id_store: string;
  comentario: string;
  image_url: string;
  autorizado: boolean;
}

/**
 * Creates a new store assignment
 * Endpoint: POST /api/assignments
 */
export const createAssignment = async (payload: AssignmentPayload): Promise<any> => {
  const res = await auth.fetch(`${API_URL}/assignments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error creando asignación' }));
    throw new Error(data.message || 'Error al crear la asignación');
  }

  return await res.json();
};

/**
 * Adds a user to the ghost system for a store
 * Endpoint: POST /api/external/t1/identity/v3/add_user_system/ghost
 */
export const addUserSystemGhost = async (sellerId: number | string, email: string): Promise<any> => {
  const res = await auth.fetch(`${API_URL}/external/t1/identity/v3/add_user_system/ghost`, {
    method: 'POST',
    body: JSON.stringify({ seller_id: Number(sellerId), email }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error añadiendo usuario al sistema ghost' }));
    throw new Error(data.message || 'Error al añadir usuario ghost');
  }

  return await res.json();
};

/**
 * Fetches all assignments
 * Endpoint: GET /api/assignments
 */
export const getAssignments = async (): Promise<Assignment[]> => {
  const res = await auth.fetch(`${API_URL}/assignments`, {
    method: 'GET',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error obteniendo asignaciones' }));
    throw new Error(data.message || 'Error al obtener asignaciones');
  }

  return await res.json();
};

/**
 * Fetches assignments for a specific store
 * Endpoint: GET /api/assignments/store/:storeId
 */
export const getAssignmentsByStore = async (storeId: number | string): Promise<Assignment[]> => {
  const res = await auth.fetch(`${API_URL}/assignments/store/${storeId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error obteniendo asignaciones de la tienda' }));
    throw new Error(data.message || 'Error al obtener asignaciones de la tienda');
  }

  return await res.json();
};

/**
 * Removes an assignment by store ID
 * Endpoint: DELETE /api/assignments/store/:storeId
 */
export const removeAssignment = async (storeId: string | number): Promise<any> => {
  const res = await auth.fetch(`${API_URL}/assignments/store/${storeId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error eliminando asignación' }));
    throw new Error(data.message || 'Error al eliminar la asignación');
  }

  return await res.json();
};

/**
 * Removes a user from the system
 * Endpoint: DELETE /api/external/t1/identity/v3/user_delete/:sellerId/store/:storeId
 */
export const removeUserSystem = async (sellerId: string | number, storeId: string | number): Promise<any> => {
  const res = await auth.fetch(`${API_URL}/external/t1/identity/v3/user_delete/${sellerId}/store/${storeId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Error eliminando usuario del sistema' }));
    throw new Error(data.message || 'Error al eliminar usuario del sistema');
  }

  return await res.json();
};

export default {
  findStores,
  getStoreInfo,
  getStoreIdentity,
  getSellerInfo,
  getContractPdf,
  createAssignment,
  addUserSystemGhost,
  getAssignments,
  getAssignmentsByStore,
  removeAssignment,
  removeUserSystem,
};
