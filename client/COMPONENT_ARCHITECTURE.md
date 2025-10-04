# Component-Based Architecture - Project Structure

## 📁 New File Structure

```
src/
├── components/
│   ├── layout/                    # Layout components
│   │   ├── Sidebar.jsx           ← Navigation sidebar with role-based items
│   │   └── Header.jsx            ← Top header with user info & logout
│   │
│   ├── admin/                     # Admin-specific components
│   │   ├── dashboard/
│   │   │   ├── StatsCard.jsx     ← Reusable stat card component
│   │   │   └── ActivityFeed.jsx  ← Recent activity feed component
│   │   │
│   │   ├── users/
│   │   │   ├── UserTable.jsx     ← User list table component
│   │   │   └── CreateUserDialog.jsx ← Create user modal dialog
│   │   │
│   │   └── approvals/
│   │       ├── ApprovalSettings.jsx      ← Approval settings form
│   │       └── ApprovalLevelsTable.jsx   ← Approval levels table
│   │
│   ├── ui/                        # shadcn UI components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── input.jsx
│   │   ├── table.jsx
│   │   └── ... (other shadcn components)
│   │
│   ├── theme-provider.jsx
│   └── mode-toggle.jsx
│
├── pages/
│   ├── auth/                      # Authentication pages
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── ForgotPasswordPage.jsx
│   │
│   └── admin/                     # Admin pages (orchestration only)
│       ├── AdminDashboardPage.jsx      ← Uses StatsCard & ActivityFeed
│       ├── AdminUserManagementPage.jsx ← Uses UserTable & CreateUserDialog
│       └── AdminApprovalRulesPage.jsx  ← Uses ApprovalSettings & ApprovalLevelsTable
│
├── layouts/
│   ├── AuthLayout.jsx             # Layout for auth pages
│   └── DashboardLayout.jsx        # Main dashboard layout (uses Sidebar & Header)
│
├── context/
│   └── AuthContext.jsx            # Authentication state management
│
├── constants/
│   ├── routes.js                  # Route path constants
│   ├── mockData.js                # Mock data & login credentials
│   └── countries.js               # Country data utilities
│
├── routes/
│   └── routes.jsx                 # Route configuration
│
└── lib/
    └── utils.js                   # Utility functions
```

## 🎯 Component Breakdown

### Layout Components (components/layout/)
- **Sidebar.jsx**: Navigation sidebar with role-based menu items
- **Header.jsx**: Top header displaying user role, name, theme toggle, logout

### Admin Dashboard Components (components/admin/dashboard/)
- **StatsCard.jsx**: Reusable card for displaying statistics with icon, value, and change
- **ActivityFeed.jsx**: List of recent activities with user, action, amount, and timestamp

### User Management Components (components/admin/users/)
- **UserTable.jsx**: Table displaying user list with name, role, managed by, email, status
- **CreateUserDialog.jsx**: Modal dialog for creating new users with form validation

### Approval Rules Components (components/admin/approvals/)
- **ApprovalSettings.jsx**: Form for configuring approval sequence and minimum percentage
- **ApprovalLevelsTable.jsx**: Table for managing approval levels and required approvers

## ✅ Best Practices Implemented

### 1. **Single Responsibility Principle**
- Each component has one clear purpose
- Pages orchestrate components, not implement UI directly
- Logic separated from presentation

### 2. **Component Reusability**
- `StatsCard` can be reused for any metric display
- `UserTable` accepts any user array as props
- Components are generic and configurable via props

### 3. **Separation of Concerns**
- **Pages**: Manage state and business logic
- **Components**: Handle presentation and user interaction
- **Layouts**: Define overall structure

### 4. **Prop Drilling Minimization**
- Context API for global state (auth)
- Props passed only where needed
- Callbacks for child-to-parent communication

### 5. **Clear Naming Conventions**
- Components use PascalCase
- Files match component names
- Folders group related components

### 6. **Component Composition**
```jsx
// Page orchestrates components
<AdminDashboardPage>
  <StatsCard />
  <ActivityFeed />
</AdminDashboardPage>

// Layout composes structure
<DashboardLayout>
  <Sidebar />
  <Header />
  <Outlet />
</DashboardLayout>
```

## 🔄 Component Flow Example

### AdminUserManagementPage Flow:
```
AdminUserManagementPage (State Management)
├── users state
├── handleUserCreated callback
└── Renders:
    ├── CreateUserDialog (receives users, onUserCreated)
    │   └── Handles form, validation, user creation
    └── UserTable (receives users)
        └── Displays user list in table format
```

### DashboardLayout Flow:
```
DashboardLayout (Composition)
├── Gets user from AuthContext
└── Renders:
    ├── Sidebar (receives role prop)
    │   └── Displays role-based navigation
    ├── Header (uses AuthContext directly)
    │   └── Shows user info, logout
    └── Outlet (nested routes)
        └── Renders current page
```

## 📝 Component Props Interface

### StatsCard
```javascript
props: {
  title: string,
  value: string,
  change: string,
  icon: LucideIcon,
  color: string,
  bgColor: string
}
```

### UserTable
```javascript
props: {
  users: Array<User>
}
```

### CreateUserDialog
```javascript
props: {
  users: Array<User>,
  onUserCreated: (user: User) => void
}
```

### ApprovalLevelsTable
```javascript
props: {
  rules: Array<ApprovalRule>,
  onToggleRequired: (ruleId: number) => void
}
```

## 🎨 Benefits of This Architecture

1. **Maintainability**: Easy to locate and update specific UI elements
2. **Testability**: Components can be tested in isolation
3. **Scalability**: New features can be added as new components
4. **Reusability**: Components can be used across different pages
5. **Readability**: Clear structure makes codebase easy to understand
6. **Collaboration**: Multiple developers can work on different components

## 🚀 Future Enhancements

- Add PropTypes or TypeScript for type safety
- Create shared/common components folder for cross-role components
- Implement component documentation with Storybook
- Add unit tests for each component
- Create custom hooks for shared logic
- Implement code splitting for better performance
