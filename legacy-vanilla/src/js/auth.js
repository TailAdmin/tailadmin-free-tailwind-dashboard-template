const API_URL = "http://localhost:3000/api"; // Updated with /api prefix

export const auth = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email, password }), // Using 'correo' as requested
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const token = data.access_token || data.token; // Handle different backend responses

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

  getToken: () => {
    return localStorage.getItem("jwt");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("jwt");
  },

  checkAuth: () => {
    const publicPages = ["/auth/login", "/signup.html", "/signin.html"];
    const currentPath = window.location.pathname.replace(/\/$/, ""); // Remove trailing slash

    const isAuthenticated = auth.isAuthenticated();

    if (!isAuthenticated && !publicPages.includes(currentPath) && currentPath !== "" && currentPath !== "/index.html") {
      window.location.href = "/auth/login";
    }

    if (isAuthenticated && (publicPages.includes(currentPath) || currentPath === "" || currentPath === "/index.html")) {
      window.location.href = "/dashboard";
    }
  },

  fetch: async (url, options = {}) => {
    const token = auth.getToken();
    const headers = {
      ...options.headers,
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
