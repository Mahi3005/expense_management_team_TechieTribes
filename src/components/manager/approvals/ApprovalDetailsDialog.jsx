import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, FileText, User, DollarSign, Tag, TrendingUp, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import { convertCurrency, parseAmount } from "@/lib/currencyUtils";
import { toast } from "sonner";

export const ApprovalDetailsDialog = ({ expense, open, onOpenChange, onApprove, onReject }) => {
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isConverting, setIsConverting] = useState(true);
  const [approvalComment, setApprovalComment] = useState('');

  const COMPANY_BASE_CURRENCY = 'INR';
  const COMPANY_CURRENCY_SYMBOL = '₹';

  useEffect(() => {
    if (expense && open) {
      convertExpenseAmount();
      setApprovalComment('');
    }
  }, [expense, open]);

  const convertExpenseAmount = async () => {
    if (!expense) return;
    
    setIsConverting(true);
    const { amount, currency } = parseAmount(expense.amount);

    if (currency === COMPANY_BASE_CURRENCY) {
      setConvertedAmount({
        amount: amount,
        originalAmount: amount,
        originalCurrency: currency,
        conversionRate: 1
      });
      setIsConverting(false);
      return;
    }

    const conversion = await convertCurrency(amount, currency, COMPANY_BASE_CURRENCY);
    
    if (conversion.success) {
      setConvertedAmount({
        amount: conversion.amount,
        originalAmount: amount,
        originalCurrency: currency,
        conversionRate: conversion.rate
      });
    } else {
      setConvertedAmount({
        amount: amount,
        originalAmount: amount,
        originalCurrency: currency,
        conversionRate: 1
      });
    }
    setIsConverting(false);
  };

  if (!expense) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'waiting approval':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'submitted':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const isActionable = expense.status.toLowerCase() !== 'approved' && expense.status.toLowerCase() !== 'rejected';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Expense Approval Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(expense.status)}>
              {expense.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Expense ID: #{expense.id}
            </span>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{expense.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">Request Owner</p>
                <p className="text-sm text-muted-foreground">{expense.paidBy}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground">{expense.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{expense.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">Amount Details</p>
                {isConverting ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Converting currency...</span>
                  </div>
                ) : convertedAmount ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {COMPANY_CURRENCY_SYMBOL} {convertedAmount.amount}
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Company Base Currency ({COMPANY_BASE_CURRENCY})
                        </div>
                      </div>
                    </div>
                    
                    {convertedAmount.originalCurrency !== COMPANY_BASE_CURRENCY && (
                      <div className="p-3 bg-muted rounded-lg space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Original Amount:</span>{' '}
                          <span className="font-semibold">{convertedAmount.originalCurrency} {convertedAmount.originalAmount}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Conversion Rate: 1 {convertedAmount.originalCurrency} = {convertedAmount.conversionRate?.toFixed(4)} {COMPANY_BASE_CURRENCY}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          ✓ Auto-converted using real-time exchange rates
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {expense.remarks && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">Remarks</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{expense.remarks}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {expense.approvalHistory && expense.approvalHistory.length > 0 && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-semibold">Approval History</p>
                </div>
                <div className="space-y-2">
                  {expense.approvalHistory.map((history, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      {history.action === 'Approved' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{history.approver}</p>
                          <Badge variant={history.action === 'Approved' ? 'default' : 'destructive'}>
                            {history.action}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{history.timestamp}</p>
                        {history.comment && (
                          <p className="text-sm mt-2 italic">"{history.comment}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {isActionable && (
            <>
              <div className="space-y-2">
                <Label htmlFor="comment">Add Comment *</Label>
                <Textarea
                  id="comment"
                  placeholder="Add your comments or reason for approval/rejection..."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Comments are required and will be visible to the employee
                </p>
              </div>
              <Separator />
            </>
          )}

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Smart Currency Conversion:</span> Expenses submitted in any currency are automatically converted to your company's base currency ({COMPANY_BASE_CURRENCY}) using real-time exchange rates.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setApprovalComment('');
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            {isActionable && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!approvalComment.trim()) {
                      toast.error('Please add a comment before rejecting');
                      return;
                    }
                    onReject(expense, approvalComment);
                    setApprovalComment('');
                    onOpenChange(false);
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (!approvalComment.trim()) {
                      toast.error('Please add a comment before approving');
                      return;
                    }
                    onApprove(expense, approvalComment);
                    setApprovalComment('');
                    onOpenChange(false);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
