// contexts/AuthContext.jsx - Updated with token expiration checking
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Updated import

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Token validation utility
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired with 5 minute buffer
    return decodedToken.exp < (currentTime + 300);
  } catch (error) {
    console.error('❌ Token decode error:', error);
    return true;
  }
};

// Check if token expires within the next hour
const isTokenExpiringSoon = (token) => {
  if (!token) return false;
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeToExpiry = decodedToken.exp - currentTime;
    
    return timeToExpiry < 3600; // Less than 1 hour
  } catch (error) {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenWarning, setTokenWarning] = useState(false);

  // Check authentication and token validity on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('🔍 Checking authentication and token validity...');
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          // Check if token is expired
          if (isTokenExpired(token)) {
            console.log('❌ Token expired, clearing authentication');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          } else {
            const parsedUser = JSON.parse(userData);
            
            // Validate user data structure
            if (parsedUser && parsedUser.role && parsedUser.email) {
              console.log('✅ Valid authentication found:', {
                email: parsedUser.email,
                role: parsedUser.role,
                tokenExpiringSoon: isTokenExpiringSoon(token)
              });
              
              setUser(parsedUser);
              
              // Set warning if token is expiring soon
              if (isTokenExpiringSoon(token)) {
                setTokenWarning(true);
              }
            } else {
              console.log('❌ Invalid user data structure, clearing auth');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        } else {
          console.log('❌ No authentication found');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error checking auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Periodic token check every 5 minutes
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        console.log('⚠️ Token expired during session, logging out');
        logout();
      } else if (token && isTokenExpiringSoon(token)) {
        setTokenWarning(true);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  const login = (userData, token) => {
    try {
      console.log('🔄 AuthContext: Logging in user:', {
        email: userData.email,
        role: userData.role
      });
      
      // Validate user data before storing
      if (!userData.role || !userData.email) {
        throw new Error('Invalid user data: missing role or email');
      }
      
      // Validate token
      if (isTokenExpired(token)) {
        throw new Error('Received expired token');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setTokenWarning(false);
      
      console.log('✅ AuthContext: User logged in successfully');
    } catch (error) {
      console.error('❌ AuthContext: Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      console.log('🔄 AuthContext: Logging out user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setTokenWarning(false);
      console.log('✅ AuthContext: User logged out successfully');
    } catch (error) {
      console.error('❌ AuthContext: Error during logout:', error);
    }
  };

  const refreshToken = async () => {
    // You can implement token refresh logic here if needed
    console.log('🔄 Token refresh not implemented yet');
  };

  const value = {
    user,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user' || user?.role === 'admin',
    loading,
    tokenWarning
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
