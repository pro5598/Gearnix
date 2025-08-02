import { useNavigate, useParams } from "react-router-dom";
import { Shield, X, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChangeRoleModal({ isOpen, onClose, onConfirm, user }) {
  const navigate = useNavigate();
  const params = useParams();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'user': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="h-5 w-5" />;
      case 'user': return <User className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return 'Full system access with all permissions';
      case 'user': return 'Standard user access with basic permissions';
      default: return 'Standard access level';
    }
  };

  const handleRoleChange = (newRole) => {
    onConfirm(newRole);
  };

  const handleClose = () => {
    navigate('/admin/users');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !user) return null;

  // Removed 'moderator' from roles array
  const roles = ['user', 'admin'];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      {/* Fixed container with proper max-height and overflow handling */}
      <div className="bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-lg border border-gray-700 shadow-2xl mx-2 sm:mx-0 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Change User Role</h2>
            </div>
            <p className="text-gray-400 text-sm mt-1">User ID: {params.id}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-sm">Current role:</span>
                    <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <h3 className="text-white font-semibold mb-4">Select New Role</h3>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`w-full p-3 sm:p-4 rounded-lg border transition-all text-left ${
                        user.role === role
                          ? 'border-purple-500/50 bg-purple-600/20 cursor-not-allowed opacity-75'
                          : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                      }`}
                      disabled={user.role === role}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getRoleColor(role)}`}>
                            {getRoleIcon(role)}
                          </div>
                          <div>
                            <div className="text-white font-medium capitalize flex items-center gap-2">
                              {role}
                              {user.role === role && (
                                <span className="text-xs text-purple-400">(Current)</span>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {getRoleDescription(role)}
                            </div>
                          </div>
                        </div>
                        <Badge className={getRoleColor(role)}>{role}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Warning for Admin Role */}
              {user.role !== 'admin' && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-yellow-400 font-medium text-sm">Role Change Notice</h4>
                      <p className="text-gray-300 text-sm mt-1">
                        Changing user roles will immediately affect their access permissions. 
                        Admin role grants full system access.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
