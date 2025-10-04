import { useState } from 'react';
import { mockExpenses } from '@/constants/mockData';
import { ExpenseTable } from '@/components/employee/expenses/ExpenseTable';
import { CreateExpenseDialog } from '@/components/employee/expenses/CreateExpenseDialog';
import { ExpenseDetailsView } from '@/components/employee/expenses/ExpenseDetailsView';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter } from 'lucide-react';

export const EmployeeDashboardPage = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleExpenseCreated = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
  };

  // Filter and search logic
  const filterExpenses = (expenseList) => {
    return expenseList.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.paidBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const uploadedExpenses = filterExpenses(
    expenses.filter(e => 
      e.status === 'Draft' || e.status === 'Submitted' || 
      e.status === 'Waiting Approval' || e.status === 'Approved'
    )
  );

  const newExpenses = filterExpenses(expenses.filter(e => e.status === 'Draft'));

  const categories = ['all', ...new Set(expenses.map(e => e.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">My Expenses</h3>
          <p className="text-sm text-muted-foreground">
            Upload receipts and track your expense submissions
          </p>
        </div>
        <CreateExpenseDialog onExpenseCreated={handleExpenseCreated} />
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by description, paid by, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="upload">Upload ({uploadedExpenses.length})</TabsTrigger>
          <TabsTrigger value="new">New ({newExpenses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Total expenses awaiting approval</p>
            <p className="font-semibold">
              {uploadedExpenses.filter(e => e.status === 'Waiting Approval').length} pending
            </p>
          </div>
          <ExpenseTable expenses={uploadedExpenses} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Expenses in draft state</p>
            <p className="font-semibold">{newExpenses.length} drafts</p>
          </div>
          <ExpenseTable expenses={newExpenses} onViewDetails={handleViewDetails} />
        </TabsContent>
      </Tabs>

      {/* Show expense details when clicked */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedExpense(null)}>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <ExpenseDetailsView 
              expense={selectedExpense} 
              onClose={() => setSelectedExpense(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};