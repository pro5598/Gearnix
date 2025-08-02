import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  UserCheck,
  UserX,
  MoreHorizontal,
  X,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import the modal components
import AddUserModal from "../Admin/modals/AddUserModal";
import EditUserModal from "../Admin/modals/EditUserModal";
import ViewUserModal from "../Admin/modals/ViewUserModal";
import DeleteUserModal from "../Admin/modals/DeleteUserModal";
import ChangeRoleModal from "../Admin/modals/ChangeRoleModal";

export default function ManageUsers() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-15",
      orders: 12,
      spent: 1250.00,
      phone: "+1 234 567 8900",
      address: "123 Main St, City, State"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      status: "active",
      joinDate: "2023-12-10",
      orders: 8,
      spent: 890.50,
      phone: "+1 234 567 8901",
      address: "456 Oak Ave, City, State"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "user",
      status: "inactive",
      joinDate: "2024-02-20",
      orders: 3,
      spent: 299.99,
      phone: "+1 234 567 8902",
      address: "789 Pine St, City, State"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "moderator",
      status: "active",
      joinDate: "2024-01-08",
      orders: 15,
      spent: 2100.75,
      phone: "+1 234 567 8903",
      address: "321 Elm St, City, State"
    },
  ]);

  // Determine which modal should be open based on current route
  const getCurrentModal = () => {
    const path = location.pathname;
    const userId = params.id ? parseInt(params.id) : null;
    
    console.log('Current path:', path);
    console.log('User ID:', userId);
    
    if (path === '/admin/users/add') {
      return { type: 'add', user: null };
    } else if (path.includes('/edit') && userId) {
      const user = users.find(u => u.id === userId);
      console.log('Edit user found:', user);
      return { type: 'edit', user };
    } else if (path.includes('/view') && userId) {
      const user = users.find(u => u.id === userId);
      console.log('View user found:', user);
      return { type: 'view', user };
    } else if (path.includes('/delete') && userId) {
      const user = users.find(u => u.id === userId);
      console.log('Delete user found:', user);
      return { type: 'delete', user };
    } else if (path.includes('/change-role') && userId) {
      const user = users.find(u => u.id === userId);
      console.log('Change role user found:', user);
      return { type: 'changeRole', user };
    }
    
    return { type: null, user: null };
  };

  const currentModal = getCurrentModal();

  // Update selected user when route changes
  useEffect(() => {
    if (currentModal.user) {
      setSelectedUser(currentModal.user);
    } else {
      setSelectedUser(null);
    }
  }, [location.pathname, params.id, users]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderator': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'user': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Navigation helpers
  const navigateToModal = (type, userId = null) => {
    const basePath = '/admin/users';
    switch (type) {
      case 'add':
        navigate(`${basePath}/add`);
        break;
      case 'edit':
        navigate(`${basePath}/${userId}/edit`);
        break;
      case 'view':
        navigate(`${basePath}/${userId}/view`);
        break;
      case 'delete':
        navigate(`${basePath}/${userId}/delete`);
        break;
      case 'changeRole':
        navigate(`${basePath}/${userId}/change-role`);
        break;
      default:
        navigate('/admin/users');
    }
  };

  const closeModal = () => {
    navigate('/admin/users');
  };

  // CRUD operations
  const handleAddUser = (newUserForm) => {
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...newUserForm,
      joinDate: new Date().toISOString().split('T')[0],
      orders: 0,
      spent: 0
    };
    setUsers([...users, newUser]);
    closeModal();
  };

  const handleEditUser = (editForm) => {
    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...editForm } : user
    ));
    closeModal();
  };

  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    closeModal();
  };

  const handleChangeRole = (newRole) => {
    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...user, role: newRole } : user
    ));
    closeModal();
  };

  const handleToggleStatus = (user) => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                Manage Users
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Manage user accounts and permissions
              </p>
            </div>
            <Button 
              onClick={() => navigateToModal('add')}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-gray-400 text-xs font-medium">Total Users</p>
                  <p className="text-lg sm:text-xl font-bold text-white">{users.length}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 self-end sm:self-auto" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-gray-400 text-xs font-medium">Active Users</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600/20 rounded-lg flex items-center justify-center self-end sm:self-auto">
                  <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-gray-400 text-xs font-medium">Inactive Users</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {users.filter(u => u.status === 'inactive').length}
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600/20 rounded-lg flex items-center justify-center self-end sm:self-auto">
                  <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-gray-400 text-xs font-medium">Admins</p>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600/20 rounded-lg flex items-center justify-center self-end sm:self-auto">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter - Responsive */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 text-sm sm:text-base"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600 w-full sm:w-auto justify-between sm:justify-center"
                size="sm"
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="sm:hidden">Filter</span>
                  <span className="hidden sm:inline">Role: {filterRole === "all" ? "All" : filterRole}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 w-56">
              <DropdownMenuItem onClick={() => setFilterRole("all")} className="text-white hover:bg-gray-700">
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("admin")} className="text-white hover:bg-gray-700">
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("moderator")} className="text-white hover:bg-gray-700">
                Moderator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("user")} className="text-white hover:bg-gray-700">
                User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Users Table/Cards - Responsive */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Orders</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Total Spent</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Join Date</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="cursor-pointer"
                        >
                          <Badge className={`text-xs ${getStatusColor(user.status)} hover:opacity-80 transition-opacity`}>
                            {user.status}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-4 px-4 text-white">{user.orders}</td>
                      <td className="py-4 px-4 text-green-400 font-medium">${user.spent.toFixed(2)}</td>
                      <td className="py-4 px-4 text-gray-300">{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem 
                              onClick={() => navigateToModal('view', user.id)}
                              className="text-white hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigateToModal('edit', user.id)}
                              className="text-white hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigateToModal('changeRole', user.id)}
                              className="text-white hover:bg-gray-700"
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigateToModal('delete', user.id)}
                              className="text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="bg-gray-700/30 border-gray-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm sm:text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm sm:text-base truncate">{user.name}</h3>
                            <p className="text-gray-400 text-xs sm:text-sm truncate">{user.email}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                <MoreHorizontal className="h-4 w-4 text-white" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700" align="end">
                              <DropdownMenuItem 
                                onClick={() => navigateToModal('view', user.id)}
                                className="text-white hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => navigateToModal('edit', user.id)}
                                className="text-white hover:bg-gray-700"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => navigateToModal('changeRole', user.id)}
                                className="text-white hover:bg-gray-700"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => navigateToModal('delete', user.id)}
                                className="text-red-400 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm mb-3">
                          <div>
                            <span className="text-gray-400">Role:</span>
                            <Badge className={`ml-1 text-xs ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="cursor-pointer ml-1"
                            >
                              <Badge className={`text-xs ${getStatusColor(user.status)} hover:opacity-80 transition-opacity`}>
                                {user.status}
                              </Badge>
                            </button>
                          </div>
                          <div>
                            <span className="text-gray-400">Orders:</span>
                            <span className="text-white ml-1">{user.orders}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Spent:</span>
                            <span className="text-green-400 font-medium ml-1">${user.spent.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs sm:text-sm">
                          <span className="text-gray-400">Joined:</span>
                          <span className="text-white ml-1">{new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal Components - Responsive by default */}
        <AddUserModal 
          isOpen={currentModal.type === 'add'}
          onClose={closeModal}
          onSubmit={handleAddUser}
        />

        <EditUserModal 
          isOpen={currentModal.type === 'edit'}
          onClose={closeModal}
          onSubmit={handleEditUser}
          user={selectedUser}
        />

        <ViewUserModal 
          isOpen={currentModal.type === 'view'}
          onClose={closeModal}
          user={selectedUser}
        />

        <DeleteUserModal 
          isOpen={currentModal.type === 'delete'}
          onClose={closeModal}
          onConfirm={handleDeleteUser}
          user={selectedUser}
        />

        <ChangeRoleModal 
          isOpen={currentModal.type === 'changeRole'}
          onClose={closeModal}
          onConfirm={handleChangeRole}
          user={selectedUser}
        />
      </div>
    </div>
  );
}
