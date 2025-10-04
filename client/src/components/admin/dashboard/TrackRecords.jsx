import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Calendar, 
    DollarSign, 
    User, 
    FileText,
    Building2,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const TrackRecords = ({ records, currency = '$' }) => {
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'Rejected':
                return <XCircle className="h-4 w-4" />;
            case 'Waiting Approval':
                return <Clock className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100';
            case 'Rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-100';
            case 'Waiting Approval':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-100';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-100';
        }
    };

    const handleViewDetails = (expense) => {
        setSelectedExpense(expense);
        setIsDialogOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Expense Track Records</CardTitle>
                    <CardDescription>
                        Recent expense submissions and their current status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {records && records.length > 0 ? (
                            records.map((expense) => (
                                <div
                                    key={expense._id || expense.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={cn(
                                            "p-2 rounded-full",
                                            getStatusColor(expense.status)
                                        )}>
                                            {getStatusIcon(expense.status)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-sm truncate">
                                                    {expense.expenseId || expense.description}
                                                </p>
                                                <Badge 
                                                    variant="outline" 
                                                    className={cn("text-xs", getStatusColor(expense.status))}
                                                >
                                                    {expense.status}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {expense.employee?.name || 'Unknown'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    {currency}{expense.amount?.toLocaleString() || '0'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(expense.expenseDate)}
                                                </span>
                                            </div>
                                            
                                            {expense.description && (
                                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                                    {expense.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewDetails(expense)}
                                        className="ml-4"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No expense records found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Expense Details</DialogTitle>
                        <DialogDescription>
                            Complete information about this expense
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedExpense && (
                        <div className="space-y-4">
                            {/* Header with status */}
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedExpense.expenseId}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedExpense.description}</p>
                                </div>
                                <Badge className={cn("text-sm", getStatusColor(selectedExpense.status))}>
                                    {selectedExpense.status}
                                </Badge>
                            </div>

                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        Employee
                                    </p>
                                    <p className="font-medium">{selectedExpense.employee?.name || 'N/A'}</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Building2 className="h-3 w-3" />
                                        Department
                                    </p>
                                    <p className="font-medium">{selectedExpense.employee?.department || 'N/A'}</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        Amount
                                    </p>
                                    <p className="font-medium text-lg">
                                        {selectedExpense.currency || currency}
                                        {selectedExpense.amount?.toLocaleString() || '0'}
                                    </p>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Expense Date
                                    </p>
                                    <p className="font-medium">{formatDate(selectedExpense.expenseDate)}</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Category</p>
                                    <p className="font-medium">{selectedExpense.category || 'N/A'}</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Paid By</p>
                                    <p className="font-medium">{selectedExpense.paidBy || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Remarks */}
                            {selectedExpense.remarks && (
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Remarks</p>
                                    <p className="text-sm bg-muted p-3 rounded-md">{selectedExpense.remarks}</p>
                                </div>
                            )}

                            {/* Approval History */}
                            {selectedExpense.approvalHistory && selectedExpense.approvalHistory.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Approval History</p>
                                    <div className="space-y-2">
                                        {selectedExpense.approvalHistory.map((history, idx) => (
                                            <div 
                                                key={idx} 
                                                className="flex items-start gap-3 p-3 bg-muted rounded-md text-sm"
                                            >
                                                <div className={cn(
                                                    "p-1 rounded-full mt-0.5",
                                                    history.action === 'Approved' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-950' 
                                                        : 'bg-red-100 text-red-800 dark:bg-red-950'
                                                )}>
                                                    {history.action === 'Approved' ? (
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    ) : (
                                                        <XCircle className="h-3 w-3" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{history.approverName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {history.action} at Level {history.level} • {formatDate(history.timestamp)}
                                                    </p>
                                                    {history.comment && (
                                                        <p className="text-xs mt-1 italic">"{history.comment}"</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Receipt */}
                            {selectedExpense.receipt && (
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Receipt</p>
                                    <Button variant="outline" size="sm" className="w-full">
                                        View Receipt
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
