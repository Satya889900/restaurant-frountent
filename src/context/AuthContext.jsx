import { createContext, useState, useEffect, useContext } from "react";
import { login as loginService } from "../services/authService";

// Named export
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load from localStorage on app start with enhanced error handling
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          if (isTokenValid(parsedUser)) {
            setUser(parsedUser);
            setToken(storedToken);
          } else {
            await performLogout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthError("Failed to restore session");
        await performLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Multi-tab logout/login sync
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "token") {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setToken(storedToken || null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Token validation helper
  const isTokenValid = (userData) => {
    if (!userData?.expiresAt) return true; // If no expiry, assume valid
    const now = new Date().getTime();
    const expiry = new Date(userData.expiresAt).getTime();
    return now < expiry;
  };

  // Enhanced login
  const login = async (email, password, options = {}) => {
    try {
      // Only show global loader if not handled locally
      if (!options.localLoading) {
        setLoading(true);
      }
      setAuthError(null);

      // Call the login service
      const data = await loginService({ email, password });

      const enhancedUserData = {
        ...data, // The user object from the API response
        loginTimestamp: new Date().toISOString(),
        expiresAt: options.expiresAt || null,
      };

      setUser(enhancedUserData);
      setToken(data.token);

      localStorage.setItem("user", JSON.stringify(enhancedUserData));
      localStorage.setItem("token", data.token);

      if (options?.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      broadcastAuthChange("login");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      if (!options.localLoading) {
        setLoading(false);
      }
    }
  };

  // Logout
  const logout = async (options = {}) => await performLogout(options);

  const performLogout = async (options = {}) => {
    try {
      setLoading(true);
      setUser(null);
      setToken(null);
      setAuthError(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      if (!options.keepRememberMe) localStorage.removeItem("rememberMe");

      broadcastAuthChange("logout");

      // Optional: call backend logout endpoint
      if (options.callServer && token) {
        // await api.post('/logout', {}, { headers: { Authorization: `Bearer ${token}` }});
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Broadcast auth changes to other tabs
  const broadcastAuthChange = (action) => {
    if (typeof BroadcastChannel !== "undefined") {
      const authChannel = new BroadcastChannel("auth");
      authChannel.postMessage({ action, user, timestamp: new Date().toISOString() });
    }
  };

  // Update user profile
  const updateUser = (updatedUserData) => {
    try {
      const mergedUser = { ...user, ...updatedUserData };
      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      return { success: true };
    } catch (error) {
      console.error("Update user error:", error);
      return { success: false, error: error.message };
    }
  };

  // Role & Permission helpers
  const hasRole = (role) => user?.role === role || user?.roles?.includes(role);
  const hasPermission = (permission) => user?.permissions?.includes(permission);

  // Placeholder for refresh token
  const refreshToken = async () => {
    // Implement refresh token logic here
    // const newToken = await api.post('/refresh-token', { token });
    // setToken(newToken);
    // localStorage.setItem("token", newToken);
  };

  const clearError = () => setAuthError(null);

  // Auth status info
  const isAuthenticated = !!user && !!token;
  const authStatus = {
    isAuthenticated,
    isAdmin: hasRole("admin"),
    isUser: hasRole("user"),
    isLoading: loading,
    hasError: !!authError,
  };

  const contextValue = {
    user,
    token,
    loading,
    error: authError,
    login,
    logout,
    updateUser,
    refreshToken,
    clearError,
    hasRole,
    hasPermission,
    isAuthenticated,
    authStatus,
    userInitial: user?.name?.charAt(0)?.toUpperCase() || "U",
    loginTime: user?.loginTimestamp ? new Date(user.loginTimestamp) : null,
    sessionDuration: user?.loginTimestamp
      ? Math.floor((new Date() - new Date(user.loginTimestamp)) / (1000 * 60))
      : 0,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}

      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Authenticating...</p>
          </div>
        </div>
      )}

      {/* Global Auth Error Toast */}
      {authError && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <div className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center space-x-3 max-w-sm">
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              ⚠️
            </div>
            <div className="flex-1">
              <p className="font-medium">Authentication Error</p>
              <p className="text-sm opacity-90">{authError}</p>
            </div>
            <button
              onClick={clearError}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// HOC for protected routes
export const withAuth = (Component) => {
  return function ProtectedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading)
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );

    if (!isAuthenticated)
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">Please log in to access this page.</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300 font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      );

    return <Component {...props} />;
  };
};

// HOC for role-based routes
export const withRole = (role) => (Component) => {
  return function RoleProtectedComponent(props) {
    const { hasRole, isAuthenticated, user } = useAuth();

    if (!isAuthenticated || !hasRole(role))
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Insufficient Permissions</h2>
            <p className="text-gray-600 mb-4">
               You need <strong>{role}</strong> role to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your current role: <strong>{user?.role || "None"}</strong>
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-300 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      );

    return <Component {...props} />;
  };
};
