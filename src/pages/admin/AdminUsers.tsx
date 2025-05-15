import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UserModal } from "@/components/admin/UserModal";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import {  UserRole, type User, type UserFormData } from "@/types";
;
import { Edit, MoreHorizontal,  Search,  Trash, UserPlus } from "lucide-react";
import type { FC } from 'react';
import { useCreateUserMutation, useDeleteUserMutation, useGetUsersQuery,  useUpdateUserMutation } from '@/features/user/userApi';
import toast from 'react-hot-toast';

const AdminUsers: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

 
 
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateUser = async (data: UserFormData) => {
    try {
      await createUser({
        name: data.name,
        email: data.email,
        role: data.role
      }).unwrap();
      setIsCreateModalOpen(false);
      toast.success("User created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create user");
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    
    try {
      await updateUser({
        id: selectedUser.id,
        data: {
          name: data.name,
          role: data.role
        }
      }).unwrap();
      setIsEditModalOpen(false);
      setSelectedUser(null);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  return (
    <div>
      <PageHeader 
        title="User Management" 
        description="View and manage user accounts"
        action={{
          label: "Add User",
          onClick: handleOpenCreateModal,
        }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="relative max-w-sm">
            <Search/>
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden md:inline">Add User</span>
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {isLoadingUsers ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading users...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === UserRole.ADMIN ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
      variant="ghost" 
      size="icon"
      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Actions</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent 
    align="end"
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md min-w-[150px]"
  >
    <DropdownMenuItem 
      onClick={() => handleOpenEditModal(user)}
      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
    >
      <Edit className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" /> 
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem 
      onClick={() => handleOpenDeleteDialog(user)}
      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:bg-red-50 dark:focus:bg-red-900/30"
    >
      <Trash className="mr-2 h-4 w-4" /> 
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </motion.div>

      <UserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        isLoading={isCreating}
      />

      <UserModal
        user={selectedUser || undefined}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        isLoading={isUpdating}
      />

      <DeleteUserDialog
        user={selectedUser}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminUsers;
