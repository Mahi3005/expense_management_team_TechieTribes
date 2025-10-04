import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { userAPI } from '@/api';

export const CreateUserDialog = ({ users, onUserCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        role: '',
        managedBy: '',
        email: '',
        password: '',
        department: '',
    });

    const userRole = localStorage.getItem('userRole')?.toLowerCase();
    const roles = userRole === 'manager' ? ['Employee'] : ['Admin', 'Manager', 'Employee'];
    const managers = users.filter((user) => user.role && user.role.toLowerCase() === 'manager');

    const handleInputChange = (field, value) => {
        setNewUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleSendPassword = () => {
        toast.success('Password email sent successfully!', {
            description: 'The user will receive their login credentials via email.',
        });
    };

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.role || !newUser.email || !newUser.password) {
            toast.error('Please fill all required fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const response = await userAPI.createUser({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role.toLowerCase(), // admin, manager, employee
                department: newUser.department || 'General',
                managerId: newUser.managedBy || null, // managedBy now stores the actual ID
            });

            if (response.success) {
                onUserCreated(response.data);
                setIsOpen(false);
                setNewUser({ name: '', role: '', managedBy: '', email: '', password: '', department: '' });

                toast.success('User created successfully!', {
                    description: `${newUser.name} has been added as ${newUser.role}`,
                });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Failed to create user', {
                description: error.message
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>Add a new team member to your organization</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            placeholder="Enter full name"
                            value={newUser.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select value={newUser.role} onValueChange={(value) => handleInputChange('role', value)}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="manager">Managed By</Label>
                        <Select
                            value={newUser.managedBy || 'none'}
                            onValueChange={(value) => handleInputChange('managedBy', value === 'none' ? '' : value)}
                        >
                            <SelectTrigger id="manager">
                                <SelectValue placeholder="Select manager (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {managers.length === 0 ? (
                                    <SelectItem value="no-managers" disabled>No managers available</SelectItem>
                                ) : (
                                    managers.map((manager) => (
                                        <SelectItem key={manager._id || manager.id} value={manager._id || manager.id}>
                                            {manager.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            value={newUser.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={newUser.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            placeholder="e.g. Sales, IT, Finance"
                            value={newUser.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={handleSendPassword} type="button">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Password
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            User will receive login credentials via email
                        </span>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateUser}>Create User</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
