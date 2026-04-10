import auth, { API_URL } from '../utils/auth';
import type { Store, StoreInfo, StoreIdentityV3, ApiResponse, ApiListResponse } from '../models/store';

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

export default {
  findStores,
  getStoreInfo,
  getStoreIdentity,
  getSellerInfo,
  getContractPdf,
};
