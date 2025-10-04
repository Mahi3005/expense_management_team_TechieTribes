# Frontend API Integration Guide

This guide explains how to integrate the backend APIs into your React components.

## 📦 API Services Already Created

All API services are in `client/src/api/`:

```javascript
import { authAPI, expenseAPI, approvalAPI, userAPI } from '@/api';
```

## 🔐 Authentication Context (Recommended)

Create a context to manage auth state globally:

```javascript
// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const response = await authAPI.getMe();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

## 🔄 Update Components to Use API

### 1. Login Page

```javascript
// client/src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Login successful!');
            
            // Navigate based on role
            const user = JSON.parse(localStorage.getItem('user'));
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'manager') navigate('/manager');
            else navigate('/employee');
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <Button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    );
};
```

### 2. Employee Dashboard - Fetch Expenses

```javascript
// client/src/pages/employee/EmployeeDashboardPage.jsx
import { useState, useEffect } from 'react';
import { expenseAPI } from '@/api';
import { toast } from 'sonner';

export const EmployeeDashboardPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('');

    useEffect(() => {
        fetchExpenses();
    }, [filterCategory]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params = filterCategory ? { category: filterCategory } : {};
            const response = await expenseAPI.getExpenses(params);
            setExpenses(response.data);
        } catch (error) {
            toast.error('Failed to fetch expenses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        
        try {
            await expenseAPI.deleteExpense(id);
            toast.success('Expense deleted');
            fetchExpenses(); // Refresh list
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSubmitForApproval = async (id) => {
        try {
            await expenseAPI.submitExpense(id);
            toast.success('Submitted for approval');
            fetchExpenses();
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {/* Your UI */}
            {expenses.map(expense => (
                <div key={expense._id}>
                    <h3>{expense.description}</h3>
                    <p>{expense.currency} {expense.amount}</p>
                    <p>Status: {expense.status}</p>
                    
                    {expense.status === 'Draft' && (
                        <>
                            <Button onClick={() => handleSubmitForApproval(expense._id)}>
                                Submit
                            </Button>
                            <Button onClick={() => handleDelete(expense._id)}>
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};
```

### 3. Create Expense Dialog with File Upload

```javascript
// client/src/components/employee/expenses/CreateExpenseDialog.jsx
import { useState } from 'react';
import { expenseAPI } from '@/api';
import { processReceipt } from '@/lib/ocrUtils';
import { toast } from 'sonner';

export const CreateExpenseDialog = ({ onExpenseCreated }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        currency: 'USD',
        category: '',
        expenseDate: '',
        paidBy: '',
        remarks: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // OCR Scanning
        if (selectedFile.type.startsWith('image/')) {
            setScanning(true);
            try {
                const result = await processReceipt(selectedFile, (progress) => {
                    console.log(`OCR Progress: ${Math.round(progress * 100)}%`);
                });

                if (result.success) {
                    setFormData(prev => ({
                        ...prev,
                        description: result.data.merchant || prev.description,
                        amount: result.data.amount || prev.amount,
                        currency: result.data.currency || prev.currency,
                        category: result.data.category || prev.category
                    }));
                    toast.success('Receipt scanned successfully!');
                }
            } catch (error) {
                console.error('OCR Error:', error);
            } finally {
                setScanning(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData for file upload
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (file) {
                data.append('receipt', file);
            }

            const response = await expenseAPI.createExpense(data);
            toast.success('Expense created successfully!');
            onExpenseCreated(response.data);
            
            // Reset form
            setFormData({
                description: '',
                amount: '',
                currency: 'USD',
                category: '',
                expenseDate: '',
                paidBy: '',
                remarks: ''
            });
            setFile(null);
        } catch (error) {
            toast.error(error.message || 'Failed to create expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={scanning}
            />
            {scanning && <div>Scanning receipt...</div>}

            <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
            />

            <Input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
            />

            {/* ... other fields ... */}

            <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Expense'}
            </Button>
        </form>
    );
};
```

### 4. Manager Approval

```javascript
// client/src/pages/manager/ManagerDashboardPage.jsx
import { useState, useEffect } from 'react';
import { expenseAPI, approvalAPI } from '@/api';
import { toast } from 'sonner';

export const ManagerDashboardPage = () => {
    const [pendingExpenses, setPendingExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingApprovals();
    }, []);

    const fetchPendingApprovals = async () => {
        setLoading(true);
        try {
            const response = await expenseAPI.getPendingApprovals();
            setPendingExpenses(response.data);
        } catch (error) {
            toast.error('Failed to fetch pending approvals');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (expenseId, comment) => {
        try {
            await approvalAPI.approveExpense(expenseId, comment);
            toast.success('Expense approved');
            fetchPendingApprovals(); // Refresh list
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleReject = async (expenseId, comment) => {
        if (!comment) {
            toast.error('Comment is required when rejecting');
            return;
        }

        try {
            await approvalAPI.rejectExpense(expenseId, comment);
            toast.success('Expense rejected');
            fetchPendingApprovals();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div>
            {pendingExpenses.map(expense => (
                <div key={expense._id}>
                    <h3>{expense.description}</h3>
                    <p>Amount: {expense.currency} {expense.amount}</p>
                    <p>Employee: {expense.employee.name}</p>
                    <p>Status: {expense.status}</p>
                    
                    <Button onClick={() => {
                        const comment = prompt('Enter approval comment:');
                        if (comment) handleApprove(expense._id, comment);
                    }}>
                        Approve
                    </Button>
                    
                    <Button onClick={() => {
                        const comment = prompt('Enter rejection reason:');
                        if (comment) handleReject(expense._id, comment);
                    }}>
                        Reject
                    </Button>
                </div>
            ))}
        </div>
    );
};
```

### 5. Admin - User Management

```javascript
// client/src/pages/admin/AdminUserManagementPage.jsx
import { useState, useEffect } from 'react';
import { userAPI } from '@/api';
import { toast } from 'sonner';

export const AdminUserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userAPI.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (userData) => {
        try {
            await userAPI.createUser(userData);
            toast.success('User created successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleUpdateUser = async (id, userData) => {
        try {
            await userAPI.updateUser(id, userData);
            toast.success('User updated successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure?')) return;

        try {
            await userAPI.deleteUser(id);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div>
            {users.map(user => (
                <div key={user._id}>
                    <h3>{user.name}</h3>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Department: {user.department}</p>
                    
                    <Button onClick={() => handleDeleteUser(user._id)}>
                        Delete
                    </Button>
                </div>
            ))}
        </div>
    );
};
```

### 6. Admin - Approval Configuration

```javascript
// client/src/pages/admin/AdminApprovalRulesPage.jsx
import { useState, useEffect } from 'react';
import { approvalAPI, userAPI } from '@/api';
import { toast } from 'sonner';

export const AdminApprovalRulesPage = () => {
    const [config, setConfig] = useState(null);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [configRes, managersRes] = await Promise.all([
                approvalAPI.getApprovalConfig(),
                userAPI.getManagers()
            ]);
            setConfig(configRes.data);
            setManagers(managersRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfig = async () => {
        try {
            await approvalAPI.updateApprovalConfig(config);
            toast.success('Configuration saved successfully');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div>
            {/* IS MANAGER APPROVER */}
            <Checkbox
                checked={config?.isManagerApprover}
                onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, isManagerApprover: checked }))
                }
            />

            {/* Percentage Rule */}
            <Input
                type="number"
                value={config?.minApprovalPercentage}
                onChange={(e) => 
                    setConfig(prev => ({ ...prev, minApprovalPercentage: e.target.value }))
                }
            />

            <Button onClick={handleSaveConfig}>Save Configuration</Button>
        </div>
    );
};
```

## 🔄 Protected Routes

```javascript
// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

// Usage in routes
<Route 
    path="/admin/*" 
    element={
        <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
        </ProtectedRoute>
    } 
/>
```

## 📝 Next Steps

1. **Wrap App with AuthProvider** in `main.jsx`
2. **Update all components** to use API services
3. **Remove mock data** from constants
4. **Test all features** with real backend
5. **Handle loading states** properly
6. **Add error boundaries** for better UX

## ⚡ Quick Testing

```bash
# Terminal 1: Start Backend
cd server
npm run seed
npm run dev

# Terminal 2: Start Frontend
cd client
npm run dev

# Browser: http://localhost:5173
# Login: admin@expense.com / admin123
```

---

All API services are ready to use! Just import and call them in your components. 🚀
