import { useState, useEffect } from 'react';
import { expenseAPI, approvalAPI } from '@/api';
import { toast } from 'sonner';
import { 
  Loader2, 
  FileCheck, 
  User, 
  Calendar, 
  DollarSign, 
  Tag, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { appEvents, EVENT_TYPES } from '@/lib/events';

export const AdminApprovalPage = () => {
  const [pendingExpenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const fetchPendingExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await expenseAPI.getPendingApprovals();
      if (response.success && response.data) {
        setExpenses(response.data);
        // Auto-select first expense if none selected
        if (!selectedExpense && response.data.length > 0) {
          setSelectedExpense(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching pending expenses:', error);
      toast.error('Failed to load pending expenses', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense);
  };

  const openActionDialog = (type) => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedExpense) return;
    
    try {
      setIsProcessing(true);
      const response = await approvalAPI.approveExpense(selectedExpense._id, { comment });
      
      if (response.success) {
        toast.success(`Expense ${selectedExpense.expenseId || selectedExpense.id} approved!`, {
          description: 'Final approval completed'
        });
        
        // Refresh list and clear selection
        await fetchPendingExpenses();
        setSelectedExpense(null);
        setComment('');
        setActionDialogOpen(false);
        
        // Emit event to update badge
        appEvents.emit(EVENT_TYPES.APPROVAL_UPDATED);
      }
    } catch (error) {
      console.error('Error approving expense:', error);
      toast.error('Failed to approve expense', {
        description: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedExpense || !comment.trim()) {
      toast.error('Comment is required when rejecting');
      return;
    }
    
    try {
      setIsProcessing(true);
      const response = await approvalAPI.rejectExpense(selectedExpense._id, { comment });
      
      if (response.success) {
        toast.error(`Expense ${selectedExpense.expenseId || selectedExpense.id} rejected`, {
          description: comment
        });
        
        // Refresh list and clear selection
        await fetchPendingExpenses();
        setSelectedExpense(null);
        setComment('');
        setActionDialogOpen(false);
        
        // Emit event to update badge
        appEvents.emit(EVENT_TYPES.APPROVAL_UPDATED);
      }
    } catch (error) {
      console.error('Error rejecting expense:', error);
      toast.error('Failed to reject expense', {
        description: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmAction = () => {
    if (actionType === 'approve') {
      handleApprove();
    } else if (actionType === 'reject') {
      handleReject();
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Waiting Approval': { variant: 'warning', icon: Clock },
      'Approved': { variant: 'success', icon: CheckCircle2 },
      'Rejected': { variant: 'destructive', icon: XCircle },
    };
    
    const config = statusConfig[status] || { variant: 'default', icon: FileCheck };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Approvals</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve expense requests that have been approved by managers
        </p>
      </div>

      {/* 3-Panel Layout */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100%-6rem)]">
        {/* Right Panel - Pending Requests List */}
        <Card className="col-span-4 overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Pending Approvals ({pendingExpenses.length})
            </CardTitle>
            <CardDescription>
              Click to view details
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {pendingExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground p-6">
                <FileCheck className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-center">No pending approvals</p>
                <p className="text-sm text-center mt-2">All expenses have been reviewed</p>
              </div>
            ) : (
              <div className="space-y-1 p-4 pt-0">
                {pendingExpenses.map((expense) => (
                  <div
                    key={expense._id}
                    onClick={() => handleExpenseClick(expense)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedExpense?._id === expense._id
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-card hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            #{expense.expenseId || expense.id || 'N/A'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Level {expense.currentApprovalLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {expense.description}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                        selectedExpense?._id === expense._id ? 'rotate-90' : ''
                      }`} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-semibold text-primary">
                        {formatCurrency(expense.amount, expense.currency)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(expense.expenseDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="truncate">{expense.employee?.name || 'Unknown'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Center Panel - Main Content (Details) */}
        <Card className="col-span-8 overflow-hidden flex flex-col">
          {selectedExpense ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      Expense #{selectedExpense.expenseId || selectedExpense.id || 'N/A'}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Review complete expense details and approval history
                    </CardDescription>
                  </div>
                  {getStatusBadge(selectedExpense.status)}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Employee Info */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Employee Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium">{selectedExpense.employee?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{selectedExpense.employee?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department:</span>
                      <p className="font-medium">{selectedExpense.employee?.department || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Expense Details */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Expense Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium text-lg text-primary">
                        {formatCurrency(selectedExpense.amount, selectedExpense.currency)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {selectedExpense.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(selectedExpense.expenseDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Paid By:</span>
                      <p className="font-medium">{selectedExpense.paidBy || 'Self'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Description:</span>
                      <p className="font-medium mt-1">{selectedExpense.description}</p>
                    </div>
                    {selectedExpense.remarks && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Remarks:</span>
                        <p className="font-medium mt-1">{selectedExpense.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Approval History */}
                {selectedExpense.approvalHistory && selectedExpense.approvalHistory.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Approval History
                    </h3>
                    <div className="space-y-3">
                      {selectedExpense.approvalHistory.map((history, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex-shrink-0">
                            {history.action === 'Approved' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {history.approverName || 'Unknown'}
                              </span>
                              <Badge variant={history.action === 'Approved' ? 'success' : 'destructive'} className="text-xs">
                                {history.action}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Level {history.level}
                              </span>
                            </div>
                            {history.comment && (
                              <p className="text-sm text-muted-foreground">{history.comment}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(history.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Action Buttons */}
              <div className="border-t p-6 bg-muted/30">
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="destructive" 
                    onClick={() => openActionDialog('reject')}
                    className="min-w-[120px]"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => openActionDialog('approve')}
                    className="min-w-[120px]"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No expense selected</p>
                <p className="text-sm mt-2">Select an expense from the list to view details</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Expense' : 'Reject Expense'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'This will give final approval to the expense.' 
                : 'Please provide a reason for rejecting this expense.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Comment {actionType === 'reject' && <span className="text-destructive">*</span>}
            </label>
            <Textarea
              placeholder={actionType === 'approve' ? 'Add optional comment...' : 'Reason for rejection...'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={confirmAction}
              disabled={isProcessing || (actionType === 'reject' && !comment.trim())}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
