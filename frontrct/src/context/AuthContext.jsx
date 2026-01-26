import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  /* ================= RESTORE SESSION ================= */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Try to restore from localStorage first to get the role
        const storedRole = localStorage.getItem('userRole');
        const storedAccessToken = localStorage.getItem('accessToken');
        console.log('[Auth] Stored role from localStorage:', storedRole);
        console.log('[Auth] Stored access token exists:', !!storedAccessToken);
        
        if (!storedRole) {
          // No stored role means user was never logged in
          console.log('[Auth] No stored role - user not previously logged in');
          setLoading(false);
          return;
        }
        
        // If we have an access token stored, use it immediately for fast session restore
        if (storedAccessToken) {
          console.log('[Auth] Using stored access token for quick session restore');
          apiService.setAuth(storedAccessToken);
          setAccessToken(storedAccessToken);
          setUserRole(storedRole);
          setIsAuthenticated(true);
          
          // Try to refresh in background to get fresh token and user data
          try {
            console.log('[Auth] Attempting to refresh token in background');
            const response = await apiService.refreshToken(storedRole);
            if (response?.accessToken && response?.user) {
              apiService.setAuth(response.accessToken);
              setAccessToken(response.accessToken);
              setUser(response.user);
              const role = response.user.role?.toLowerCase() || storedRole;
              setUserRole(role);
              localStorage.setItem('userRole', role);
              localStorage.setItem('accessToken', response.accessToken);
              console.log('[Auth] Token refreshed successfully');
            }
          } catch (refreshErr) {
            console.warn('[Auth] Token refresh failed, but using stored token:', refreshErr.message);
          }
          
          setLoading(false);
          return;
        }
        
        // If no stored token, try to refresh using the refresh token cookie
        console.log('[Auth] No stored access token - attempting refresh via cookie');
        const response = await apiService.refreshToken(storedRole);
        if (response?.accessToken && response?.user) {
          apiService.setAuth(response.accessToken);
          setAccessToken(response.accessToken);
          setUser(response.user);
          const role = response.user.role?.toLowerCase() || storedRole;
          setUserRole(role);
          setIsAuthenticated(true);
          localStorage.setItem('userRole', role);
          localStorage.setItem('accessToken', response.accessToken);
          console.log('[Auth] Session restored successfully for role:', role);
        }
      } catch (err) {
        // If refresh fails, user needs to log in again
        console.warn('[Auth] Session restore failed:', err.message);
        localStorage.removeItem('userRole');
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (apiCall, role) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[Auth] Starting login process for role:', role);
      const response = await apiCall();
      console.log('[Auth] Login response received:', response);
      const { accessToken, user: userData } = response;

      console.log('[Auth] Login successful for role:', role);
      console.log('[Auth] Access Token:', accessToken ? `✓ Present (${accessToken.length} chars)` : '✗ Missing');
      console.log('[Auth] User Data:', userData);

      apiService.setAuth(accessToken);
      setAccessToken(accessToken);
      setUser(userData);
      setUserRole(role);
      setIsAuthenticated(true);
      localStorage.setItem('userRole', role);
      localStorage.setItem('accessToken', accessToken);
      
      console.log('[Auth] Stored role and token in localStorage');
      console.log('[Auth] API Service token set:', apiService.accessToken ? `✓ (${apiService.accessToken.length} chars)` : '✗ Missing');

      return userData;
    } catch (err) {
      console.error('[Auth] Login failed:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = useCallback(
    (email, password) =>
      handleLogin(() => apiService.loginUser(email, password), 'user'),
    []
  );

  const loginAdmin = useCallback(
    (email, password) =>
      handleLogin(() => apiService.loginAdministrator(email, password), 'admin'),
    []
  );

  const loginHost = useCallback(
    (email, password) =>
      handleLogin(() => apiService.loginHost(email, password), 'host'),
    []
  );

  /* ================= REGISTER ================= */
  const registerUser = useCallback(
    (data) => handleLogin(() => apiService.registerUser(data), 'user'),
    []
  );

  const registerAdmin = useCallback(
    (data) => handleLogin(() => apiService.registerAdministrator(data), 'admin'),
    []
  );

  const registerHost = useCallback(
    (data) => handleLogin(() => apiService.registerHost(data), 'host'),
    []
  );

  /* ================= LOGOUT ================= */
  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } catch (err) {
      console.warn('Logout API call failed (continuing anyway):', err.message);
    }
    apiService.clearAuth();
    setUser(null);
    setAccessToken(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    userRole,
    accessToken,
    loginUser,
    loginAdmin,
    loginHost,
    registerUser,
    registerAdmin,
    registerHost,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
