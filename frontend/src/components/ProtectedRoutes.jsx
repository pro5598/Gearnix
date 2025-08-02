// components/ProtectedRoutes.jsx - Enhanced with better role checking
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  allowedRoles = []
}) => {
  const { isAuthenticated, isAdmin, user, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', {
    isAuthenticated,
    isAdmin,
    userRole: user?.role,
    requireAuth,
    requireAdmin,
    allowedRoles,
    currentPath: location.pathname
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Check authentication first
  if (requireAuth && !isAuthenticated) {
    console.log('🚫 Access denied: Not authenticated');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check admin role specifically
  if (requireAdmin && !isAdmin) {
    console.log('🚫 Access denied: Admin privileges required');
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-slate-300 mb-6">
            You don't have admin privileges to access this area.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors mr-4"
          >
            Go Back
          </button>
          <Navigate to="/user/dashboard" replace />
        </div>
      </div>
    );
  }

  // Check specific roles if provided
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('🚫 Access denied: Role not allowed', {
      userRole: user?.role,
      allowedRoles
    });
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400 mb-4">Unauthorized</h1>
          <p className="text-slate-300 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated but trying to access auth pages, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    console.log('🔄 Authenticated user accessing auth page, redirecting to dashboard');
    const userRole = isAdmin ? 'admin' : 'user';
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
};

// Enhanced Admin Route with strict checking
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  // Double check for admin access
  if (!isAuthenticated || !isAdmin || user?.role !== 'admin') {
    console.log('🚫 AdminRoute: Access denied', {
      isAuthenticated,
      isAdmin,
      userRole: user?.role
    });
    
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true} allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
};

// Enhanced User Route
export const UserRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Allow both admin and user roles to access user routes
  if (!isAuthenticated || !['admin', 'user'].includes(user?.role)) {
    console.log('🚫 UserRoute: Access denied', {
      isAuthenticated,
      userRole: user?.role
    });
    
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['admin', 'user']}>
      {children}
    </ProtectedRoute>
  );
};

// Public Route (for auth pages)
export const PublicRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);
