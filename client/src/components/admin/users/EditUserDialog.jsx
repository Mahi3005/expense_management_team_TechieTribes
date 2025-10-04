import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { userAPI } from '@/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const EditUserDialog = ({ user, open, onOpenChange, onUserUpdated, managers = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'employee',
        department: '',
        managerId: '',
        isActive: true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const userRole = localStorage.getItem('userRole')?.toLowerCase();

    // Load user data when dialog opens
    useEffect(() => {
        if (user && open) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'employee',
                department: user.department || '',
                managerId: user.managerId?._id || user.managerId || '',
                isActive: user.isActive !== undefined ? user.isActive : true
            });
            setErrors({});
        }
    }, [user, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({ ...prev, role: value }));
        if (errors.role) {
            setErrors(prev => ({ ...prev, role: '' }));
        }
    };

    const handleManagerChange = (value) => {
        setFormData(prev => ({ ...prev, managerId: value === 'none' ? '' : value }));
        if (errors.managerId) {
            setErrors(prev => ({ ...prev, managerId: '' }));
        }
    };

    const handleActiveChange = (checked) => {
        setFormData(prev => ({ ...prev, isActive: checked }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                department: formData.department,
                managerId: formData.managerId || null,
                isActive: formData.isActive
            };

            const response = await userAPI.updateUser(user._id || user.id, updateData);

            if (response.success) {
                toast.success('User updated successfully!', {
                    description: `${formData.name} has been updated.`
                });
                onUserUpdated(response.data);
                onOpenChange(false);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user', {
                description: error.message || 'Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information and settings
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            disabled={isLoading}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            disabled={isLoading}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select value={formData.role} onValueChange={handleRoleChange} disabled={isLoading || userRole === 'manager'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="employee">Employee</SelectItem>
                                {userRole !== 'manager' && <SelectItem value="manager">Manager</SelectItem>}
                                {userRole !== 'manager' && <SelectItem value="admin">Admin</SelectItem>}
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Enter department"
                            disabled={isLoading}
                        />
                    </div>

                    {formData.role === 'employee' && (
                        <div className="space-y-2">
                            <Label htmlFor="manager">Manager</Label>
                            <Select value={formData.managerId || 'none'} onValueChange={handleManagerChange} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select manager (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {managers.map((manager) => (
                                        <SelectItem key={manager._id || manager.id} value={manager._id || manager.id}>
                                            {manager.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="isActive">Active Status</Label>
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={handleActiveChange}
                            disabled={isLoading}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
