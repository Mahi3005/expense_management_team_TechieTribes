import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalTable } from "@/components/manager/approvals/ApprovalTable";
import { ApprovalDetailsDialog } from "@/components/manager/approvals/ApprovalDetailsDialog";
import { expenseAPI, approvalAPI } from "@/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { appEvents, EVENT_TYPES } from "@/lib/events";

export const ManagerDashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pending approval expenses from API
  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const fetchPendingExpenses = async () => {
    try {
      setIsLoading(true);
      // Use the pending-approval endpoint which filters by manager
      const response = await expenseAPI.getPendingApprovals();
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

  const handleApprove = async (expense, comment = '') => {
    try {
      const response = await approvalAPI.approveExpense(expense._id || expense.id, { comment });
      if (response.success) {
        toast.success(`Expense ${expense.expenseId || expense.id || 'approved'}`, {
          description: 'Sent to admin for final approval'
        });
        // Refresh the list
        await fetchPendingExpenses();
        // Emit event to update badge
        appEvents.emit(EVENT_TYPES.APPROVAL_UPDATED);
      }
    } catch (error) {
      console.error('Error approving expense:', error);
      toast.error('Failed to approve expense', {
        description: error.message
      });
    }
  };

  const handleReject = async (expense, comment = '') => {
    try {
      const response = await approvalAPI.rejectExpense(expense._id || expense.id, { 
        comment: comment || 'No reason provided' 
      });
      if (response.success) {
        toast.error(`Expense ${expense.expenseId || expense.id || 'rejected'}`, {
          description: comment ? `Reason: ${comment}` : 'No reason provided'
        });
        // Refresh the list
        await fetchPendingExpenses();
        // Emit event to update badge
        appEvents.emit(EVENT_TYPES.APPROVAL_UPDATED);
      }
    } catch (error) {
      console.error('Error rejecting expense:', error);
      toast.error('Failed to reject expense', {
        description: error.message
      });
    }
  };

  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
    setDetailsDialogOpen(true);
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
      <div>
        <h1 className="text-3xl font-bold">Manager's View</h1>
        <p className="text-muted-foreground mt-1">Review and approve expense requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approvals to review</CardTitle>
          <CardDescription>
            Review pending expense approval requests from your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApprovalTable 
            expenses={expenses}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>

      <ApprovalDetailsDialog
        expense={selectedExpense}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
