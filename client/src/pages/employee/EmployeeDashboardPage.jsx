import { useState, useEffect } from 'react';
import { expenseAPI } from '@/api';
import { ExpenseTable } from '@/components/employee/expenses/ExpenseTable';
import { CreateExpenseDialog } from '@/components/employee/expenses/CreateExpenseDialog';
import { ExpenseDetailsView } from '@/components/employee/expenses/ExpenseDetailsView';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const EmployeeDashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch expenses from API
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await expenseAPI.getExpenses();
      if (response.success && response.data) {
        setExpenses(response.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseCreated = async (newExpense) => {
    // Refresh expenses list after creating new expense
    await fetchExpenses();
    toast.success('Expense created successfully!');
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