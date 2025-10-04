import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export const UserTable = ({ users, onEdit, onDelete, showActions = true }) => {
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Managed By</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        {showActions && <TableHead className="text-center">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={showActions ? 6 : 5} className="text-center text-muted-foreground py-8">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user._id || user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell className="capitalize">{user.role}</TableCell>
                                <TableCell>{user.managerId?.name || user.managedBy || 'N/A'}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.isActive 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                {showActions && (
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEdit && onEdit(user)}
                                                title="Edit user"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDelete && onDelete(user)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                title="Delete user"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
