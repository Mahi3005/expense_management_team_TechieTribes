import { useState } from 'react';
import { mockUsers } from '@/constants/mockData';
import { UserTable } from '@/components/admin/users/UserTable';
import { CreateUserDialog } from '@/components/admin/users/CreateUserDialog';

export const AdminUserManagementPage = () => {
    const [users, setUsers] = useState(mockUsers);

    const handleUserCreated = (newUser) => {
        setUsers([...users, newUser]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold">User Management</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your team members and their roles
                    </p>
                </div>
                <CreateUserDialog users={users} onUserCreated={handleUserCreated} />
            </div>

            <UserTable users={users} />
        </div>
    );
};
