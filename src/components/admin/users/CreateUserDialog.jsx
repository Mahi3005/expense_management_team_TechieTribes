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

export const CreateUserDialog = ({ users, onUserCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        role: '',
        managedBy: '',
        email: '',
    });

    const roles = ['Manager', 'Employee', 'Admin'];
    const managers = users.filter((user) => user.role === 'Manager');

    const handleInputChange = (field, value) => {
        setNewUser((prev) => ({ ...prev, [field]: value }));
    };

    const handleSendPassword = () => {
        toast.success('Password email sent successfully!', {
            description: 'The user will receive their login credentials via email.',
        });
    };

    const handleCreateUser = () => {
        if (!newUser.name || !newUser.role || !newUser.email) {
            toast.error('Please fill all required fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        const createdUser = {
            id: users.length + 1,
            name: newUser.name,
            role: newUser.role,
            managedBy: newUser.managedBy || 'N/A',
            email: newUser.email,
            status: 'active',
        };

        onUserCreated(createdUser);
        setIsOpen(false);
        setNewUser({ name: '', role: '', managedBy: '', email: '' });

        toast.success('User created successfully!', {
            description: `${createdUser.name} has been added as ${createdUser.role}`,
        });
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
                            value={newUser.managedBy}
                            onValueChange={(value) => handleInputChange('managedBy', value)}
                        >
                            <SelectTrigger id="manager">
                                <SelectValue placeholder="Select manager (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {managers.map((manager) => (
                                    <SelectItem key={manager.id} value={manager.name}>
                                        {manager.name}
                                    </SelectItem>
                                ))}
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
