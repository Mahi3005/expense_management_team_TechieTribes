import { useState, useEffect } from 'react';
import { userAPI } from '@/api';
import { UserTable } from '@/components/admin/users/UserTable';
import { CreateUserDialog } from '@/components/admin/users/CreateUserDialog';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const AdminUserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const userRole = localStorage.getItem('userRole')?.toLowerCase();

    useEffect(() => {
        fetchUsers();
        fetchManagers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            // Use different API based on role
            const response = userRole === 'manager' 
                ? await userAPI.getManagedUsers()
                : await userAPI.getAllUsers();
            if (response.success && response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users', {
                description: error.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await userAPI.getManagers();
            if (response.success && response.data) {
                setManagers(response.data);
            }
        } catch (error) {
            console.error('Error fetching managers:', error);
        }
    };

    const handleUserCreated = async (newUser) => {
        // Refresh users list after creating new user
        await fetchUsers();
        toast.success('User created successfully!');
    };

    const handleEdit = (user) => {
        // Managers can only edit employees
        if (userRole === 'manager' && user.role?.toLowerCase() !== 'employee') {
            toast.error('Permission denied', {
                description: 'Managers can only edit employee accounts.'
            });
            return;
        }
        setSelectedUser(user);
        setEditDialogOpen(true);
    };

    const handleUserUpdated = async (updatedUser) => {
        // Refresh users list after update
        await fetchUsers();
    };

    const handleDelete = (user) => {
        // Managers can only delete employees
        if (userRole === 'manager' && user.role?.toLowerCase() !== 'employee') {
            toast.error('Permission denied', {
                description: 'Managers can only delete employee accounts.'
            });
            return;
        }
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            const response = await userAPI.deleteUser(userToDelete._id || userToDelete.id);
            if (response.success) {
                toast.success('User deleted successfully!', {
                    description: `${userToDelete.name} has been removed.`
                });
                await fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user', {
                description: error.message || 'Please try again.'
            });
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold">
                        {userRole === 'manager' ? 'Team Management' : 'User Management'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {userRole === 'manager' 
                            ? 'View and manage your team members' 
                            : 'Manage your team members and their roles'}
                    </p>
                </div>
                {userRole !== 'manager' && <CreateUserDialog users={users} onUserCreated={handleUserCreated} />}
            </div>

            <UserTable 
                users={users} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
            />

            {/* Edit User Dialog */}
            <EditUserDialog
                user={selectedUser}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onUserUpdated={handleUserUpdated}
                managers={managers}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{userToDelete?.name}</strong> from the system.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
