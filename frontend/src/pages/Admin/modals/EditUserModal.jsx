import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditUserModal({ isOpen, onClose, onSubmit, user }) {
  const navigate = useNavigate();
  const params = useParams();
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (user) {
      setEditForm({ ...user });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editForm);
    // Navigate back to users page after successful edit
    navigate('/admin/users');
  };

  const handleClose = () => {
    setEditForm({});
    // Navigate back to users page
    navigate('/admin/users');
  };

  // Handle browser back button
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <div>
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Edit User</h2>
            </div>
            <p className="text-gray-400 text-sm mt-1">User ID: {params.id}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">Name</Label>
                <Input
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">Phone</Label>
                <Input
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">Role</Label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="user" className="text-white hover:bg-gray-700">User</SelectItem>
                    <SelectItem value="moderator" className="text-white hover:bg-gray-700">Moderator</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-gray-700">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Address</Label>
              <Input
                value={editForm.address || ''}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Status</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
                  <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-none">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} className="border-gray-600 text-gray-300">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
