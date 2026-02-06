import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// User roles - JWT-based role system
export const USER_ROLES = {
  RANGER: 'ranger',
  FARMER: 'farmer',
  PUBLIC: 'public',
};

// Mock JWT token generator (simulates backend response)
const generateMockToken = (role, userData) => {
  const payload = {
    sub: userData.id,
    role: role,
    name: userData.name,
    email: userData.email,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  // Base64 encode (mock JWT - in production this would be from backend)
  return btoa(JSON.stringify(payload));
};

// Decode mock token
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check token validity
  const isTokenValid = useCallback((tokenData) => {
    if (!tokenData) return false;
    return tokenData.exp > Date.now();
  }, []);

  useEffect(() => {
    // Check for stored auth on mount
    const storedToken = localStorage.getItem('wildlife_token');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded && isTokenValid(decoded)) {
        setToken(storedToken);
        setRole(decoded.role);
        setUser({
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        });
      } else {
        // Clear invalid token
        localStorage.removeItem('wildlife_token');
      }
    }
    setIsLoading(false);
  }, [isTokenValid]);

  // Ranger login with credentials
  const loginAsRanger = async (email, password) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email === 'ranger@wildlife.gov' && password === 'demo123') {
      const userData = {
        id: 'ranger-001',
        name: 'Forest Ranger',
        email: email,
        designation: 'Senior Wildlife Officer',
      };
      const mockToken = generateMockToken(USER_ROLES.RANGER, userData);
      
      setToken(mockToken);
      setRole(USER_ROLES.RANGER);
      setUser({ ...userData, role: USER_ROLES.RANGER });
      localStorage.setItem('wildlife_token', mockToken);
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
  };

  // Farmer login with credentials
  const loginAsFarmer = async (email, password) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Demo farmer credentials
    if (email === 'farmer@village.com' && password === 'farm123') {
      const userData = {
        id: 'farmer-001',
        name: 'Ramesh Kumar',
        email: email,
        village: 'Nainital Village',
        farmlandId: 'FARM-2847',
      };
      const mockToken = generateMockToken(USER_ROLES.FARMER, userData);
      
      setToken(mockToken);
      setRole(USER_ROLES.FARMER);
      setUser({ ...userData, role: USER_ROLES.FARMER });
      localStorage.setItem('wildlife_token', mockToken);
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
  };

  // Public access - no login required
  const enterAsPublic = () => {
    const userData = {
      id: 'public-guest',
      name: 'Wildlife Visitor',
      email: null,
    };
    const mockToken = generateMockToken(USER_ROLES.PUBLIC, userData);
    
    setToken(mockToken);
    setRole(USER_ROLES.PUBLIC);
    setUser({ ...userData, role: USER_ROLES.PUBLIC });
    localStorage.setItem('wildlife_token', mockToken);
  };

  // Unified login function that routes based on role
  const login = async (email, password, userRole) => {
    switch (userRole) {
      case USER_ROLES.RANGER:
        return loginAsRanger(email, password);
      case USER_ROLES.FARMER:
        return loginAsFarmer(email, password);
      case USER_ROLES.PUBLIC:
        enterAsPublic();
        return { success: true };
      default:
        return { success: false, error: 'Invalid role' };
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('wildlife_token');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  // Role check helpers
  const isRanger = role === USER_ROLES.RANGER;
  const isFarmer = role === USER_ROLES.FARMER;
  const isPublicUser = role === USER_ROLES.PUBLIC;

  const value = {
    user,
    role,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    isRanger,
    isFarmer,
    isPublicUser,
    login,
    loginAsRanger,
    loginAsFarmer,
    enterAsPublic,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
