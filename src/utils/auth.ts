// Read API base url from Vite env variable VITE_API_URL, fallback to localhost
const rawApi = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';
export const API_URL = rawApi.replace(/\/$/, '') + '/api';

// Decodifica el payload de un JWT y devuelve el objeto (cliente)
export const getUserFromToken = (): any | null => {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // atob en navegador; reemplazar URL-safe base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const getUserRole = (): string | null => {
  const user = getUserFromToken();
  if (!user) return null;
  if (user.role) return user.role;
  if (user.roles && Array.isArray(user.roles)) return user.roles[0];
  return null;
};

export const auth = {
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const token = data.access_token || data.token;

      if (token) {
        localStorage.setItem("jwt", token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("jwt");
    window.location.href = "/auth/login";
  },

  getToken: (): string | null => {
    return localStorage.getItem("jwt");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("jwt");
  },

  fetch: async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = auth.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      auth.logout();
    }

    return response;
  }
};

export default auth;
