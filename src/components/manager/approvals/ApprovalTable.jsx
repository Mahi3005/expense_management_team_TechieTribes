import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye } from "lucide-react";
import { convertCurrency, parseAmount } from "@/lib/currencyUtils";

export const ApprovalTable = ({ expenses, onApprove, onReject, onViewDetails }) => {
  const [convertedExpenses, setConvertedExpenses] = useState([]);
  const [isConverting, setIsConverting] = useState(true);

  // Company's base currency (should come from admin settings in real app)
  const COMPANY_BASE_CURRENCY = 'INR';
  const COMPANY_CURRENCY_SYMBOL = '₹';

  useEffect(() => {
    convertExpenses();
  }, [expenses]);

  const convertExpenses = async () => {
    setIsConverting(true);
    const converted = await Promise.all(
      expenses.map(async (expense) => {
        // Parse the amount string to get numeric value and currency
        const { amount, currency } = parseAmount(expense.amount);

        // If already in company currency, no conversion needed
        if (currency === COMPANY_BASE_CURRENCY) {
          return {
            ...expense,
            convertedAmount: amount,
            originalAmount: amount,
            originalCurrency: currency,
            conversionRate: 1
          };
        }

        // Convert to company currency
        const conversion = await convertCurrency(amount, currency, COMPANY_BASE_CURRENCY);

        if (conversion.success) {
          return {
            ...expense,
            convertedAmount: conversion.amount,
            originalAmount: amount,
            originalCurrency: currency,
            conversionRate: conversion.rate
          };
        }

        // Fallback if conversion fails
        return {
          ...expense,
          convertedAmount: amount,
          originalAmount: amount,
          originalCurrency: currency,
          conversionRate: 1
        };
      })
    );
    setConvertedExpenses(converted);
    setIsConverting(false);
  };

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

  if (isConverting) {
    return (
      <div className="rounded-md border p-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Converting currencies...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Approval Subject</TableHead>
            <TableHead>Request Owner</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Request Status</TableHead>
            <TableHead>
              <div>Total Amount</div>
              <div className="text-xs font-normal text-muted-foreground">(in company's currency)</div>
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {convertedExpenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No approvals to review
              </TableCell>
            </TableRow>
          ) : (
            convertedExpenses.map((expense) => (
              <TableRow 
                key={expense.id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => onViewDetails && onViewDetails(expense)}
              >
                <TableCell className="font-medium">{expense.approvalSubject || 'none'}</TableCell>
                <TableCell>{expense.paidBy}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(expense.status)}>
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {COMPANY_CURRENCY_SYMBOL} {expense.convertedAmount}
                    </div>
                    {expense.originalCurrency !== COMPANY_BASE_CURRENCY && (
                      <div className="text-xs text-muted-foreground">
                        Original: {expense.originalCurrency} {expense.originalAmount}
                        <span className="ml-1">(Rate: {expense.conversionRate?.toFixed(4)})</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails && onViewDetails(expense);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(expense);
                      }}
                      disabled={expense.status.toLowerCase() === 'approved' || expense.status.toLowerCase() === 'rejected'}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(expense);
                      }}
                      disabled={expense.status.toLowerCase() === 'approved' || expense.status.toLowerCase() === 'rejected'}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <div className="p-4 border-t bg-muted/30">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">💡 Note:</span> All amounts are automatically converted to company base currency ({COMPANY_BASE_CURRENCY}) using real-time exchange rates. Original amounts and conversion rates are shown for reference.
        </p>
      </div>
    </div>
  );
};
