// components/ProtectedRoutes.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  allowedRoles = [],
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

  // Show loading screen while auth is being verified
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

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('🚫 Access denied: Not authenticated');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Admin-only route check
  if (requireAdmin && !isAdmin) {
    console.log('🚫 Access denied: Admin privileges required');
    return <Navigate to="/user/dashboard" replace />;
  }

  // Specific role-based check
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

  // Prevent logged-in users from visiting public routes (like login/register)
  if (!requireAuth && isAuthenticated) {
    console.log('🔄 Authenticated user accessing public page, redirecting to dashboard');
    const userRole = isAdmin ? 'admin' : 'user';
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  // Access granted
  return children;
};

// 🔒 Admin-only route
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requireAuth={true} requireAdmin={true} allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

// 👤 User (or admin) route
export const UserRoute = ({ children }) => (
  <ProtectedRoute requireAuth={true} allowedRoles={['admin', 'user']}>
    {children}
  </ProtectedRoute>
);

// 🌐 Public route (like login/register) — redirect if already logged in
export const PublicRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);
