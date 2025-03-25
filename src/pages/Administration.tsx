
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Edit, Trash, UserPlus } from "lucide-react";

// Define user role types
type UserRole = "admin" | "manager" | "staff";

// Define permissions structure
interface Permission {
  id: string;
  name: string;
  description: string;
}

// Define user structure
interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  permissions: Record<string, boolean>;
  lastLogin?: string;
}

const Administration = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('restaurant-users-data');
    return savedUsers ? JSON.parse(savedUsers) : [
      {
        id: "1",
        username: "admin",
        fullName: "System Administrator",
        email: "admin@example.com",
        role: "admin",
        isActive: true,
        permissions: {
          "manage_users": true,
          "manage_employees": true, 
          "manage_payroll": true,
          "view_reports": true,
          "manage_leaves": true
        },
        lastLogin: new Date().toISOString()
      }
    ];
  });
  
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Omit<User, "id"> & { password: string }>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "staff",
    isActive: true,
    permissions: {
      "manage_users": false,
      "manage_employees": false,
      "manage_payroll": false,
      "view_reports": true,
      "manage_leaves": false
    }
  });

  // Available permissions
  const availablePermissions: Permission[] = [
    { id: "manage_users", name: "Manage Users", description: "Create, edit, and delete user accounts" },
    { id: "manage_employees", name: "Manage Employees", description: "Create, edit, and delete employee records" },
    { id: "manage_payroll", name: "Manage Payroll", description: "Process and manage payroll" },
    { id: "view_reports", name: "View Reports", description: "Access and download reports" },
    { id: "manage_leaves", name: "Manage Leaves", description: "Approve and manage employee leaves" }
  ];

  // Save users to localStorage
  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('restaurant-users-data', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle role change
  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role: value,
      // Set default permissions based on role
      permissions: {
        ...prev.permissions,
        "manage_users": value === "admin",
        "manage_employees": value === "admin" || value === "manager",
        "manage_payroll": value === "admin" || value === "manager",
        "view_reports": true,
        "manage_leaves": value === "admin" || value === "manager"
      }
    }));
  };

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionId]: checked
      }
    }));
  };

  // Add or update user
  const handleSaveUser = () => {
    if (!formData.username || !formData.fullName || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              username: formData.username,
              fullName: formData.fullName,
              email: formData.email,
              role: formData.role,
              isActive: formData.isActive,
              permissions: formData.permissions
            } 
          : user
      );
      
      saveUsers(updatedUsers);
      toast({
        title: "User Updated",
        description: `${formData.fullName}'s account has been updated.`
      });
    } else {
      // Add new user
      if (!formData.password) {
        toast({
          title: "Validation Error",
          description: "Password is required for new users.",
          variant: "destructive"
        });
        return;
      }
      
      const newUser: User = {
        id: String(users.length + 1),
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
        permissions: formData.permissions
      };
      
      saveUsers([...users, newUser]);
      toast({
        title: "User Created",
        description: `${formData.fullName}'s account has been created.`
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setShowAddUserDialog(false);
    setEditingUser(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "staff",
      isActive: true,
      permissions: {
        "manage_users": false,
        "manage_employees": false,
        "manage_payroll": false,
        "view_reports": true,
        "manage_leaves": false
      }
    });
    setShowPassword(false);
  };

  // Edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      password: "", // Password is not updated unless explicitly reset
      role: user.role,
      isActive: user.isActive,
      permissions: { ...user.permissions }
    });
    setShowAddUserDialog(true);
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirmation(true);
  };

  // Confirm delete user
  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userToDelete);
    saveUsers(updatedUsers);
    
    toast({
      title: "User Deleted",
      description: "The user account has been deleted."
    });
    
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  // Toggle user status
  const toggleUserStatus = (userId: string, isActive: boolean) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, isActive } 
        : user
    );
    
    saveUsers(updatedUsers);
    
    toast({
      title: `User ${isActive ? 'Activated' : 'Deactivated'}`,
      description: `The user account has been ${isActive ? 'activated' : 'deactivated'}.`
    });
  };

  return (
    <DashboardLayout 
      title="Administration" 
      subtitle="Manage user accounts and permissions"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-500">Create and manage user accounts with different permission levels</p>
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setShowAddUserDialog(true);
          }}
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users and their access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === "1"} // Prevent deleting the main admin
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Update user information and permissions" 
                : "Create a new user account with specific permissions"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="johndoe"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="john@example.com"
                required
              />
            </div>
            
            {!editingUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleRoleChange(value as UserRole)}
              >
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-start">
              <Label className="text-right pt-2">Permissions</Label>
              <div className="col-span-3 space-y-3">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-start space-x-2">
                    <Switch
                      id={`permission-${permission.id}`}
                      checked={formData.permissions[permission.id] || false}
                      onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                    />
                    <div>
                      <Label htmlFor={`permission-${permission.id}`} className="font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-xs text-gray-500">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              resetForm();
              setShowAddUserDialog(false);
              setEditingUser(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Administration;
