import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalTable } from "@/components/manager/approvals/ApprovalTable";
import { ApprovalDetailsDialog } from "@/components/manager/approvals/ApprovalDetailsDialog";
import { mockApprovalExpenses } from "@/constants/mockData";
import { toast } from "sonner";

export const ManagerDashboardPage = () => {
  const [expenses, setExpenses] = useState(mockApprovalExpenses);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleApprove = (expense, comment = '') => {
    const now = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setExpenses(expenses.map(exp => 
      exp.id === expense.id 
        ? { 
            ...exp, 
            status: 'Approved',
            approvalHistory: [
              ...(exp.approvalHistory || []),
              {
                approver: 'John Doe',
                action: 'Approved',
                comment: comment || 'No comments provided',
                timestamp: now
              }
            ]
          }
        : exp
    ));
    toast.success(`Expense #${expense.id} has been approved`, {
      description: comment ? `Comment: ${comment}` : 'No comments added'
    });
  };

  const handleReject = (expense, comment = '') => {
    const now = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setExpenses(expenses.map(exp => 
      exp.id === expense.id 
        ? { 
            ...exp, 
            status: 'Rejected',
            approvalHistory: [
              ...(exp.approvalHistory || []),
              {
                approver: 'John Doe',
                action: 'Rejected',
                comment: comment || 'No reason provided',
                timestamp: now
              }
            ]
          }
        : exp
    ));
    toast.error(`Expense #${expense.id} has been rejected`, {
      description: comment ? `Reason: ${comment}` : 'No reason provided'
    });
  };

  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
    setDetailsDialogOpen(true);
  };

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
