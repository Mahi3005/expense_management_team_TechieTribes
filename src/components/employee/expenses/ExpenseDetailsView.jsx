import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, User, FileText, Clock } from 'lucide-react';

export const ExpenseDetailsView = ({ expense, onClose }) => {
    if (!expense) return null;

    const statusColors = {
        'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-800',
        'Waiting Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900',
        'Approved': 'bg-green-100 text-green-800 dark:bg-green-900',
        'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900',
    };

    const approvalHistory = [
        { approver: 'Sarah', status: 'Approved', time: '12:49 9th Oct, 2025' },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Expense Details
                            <Badge className={statusColors[expense.status] || statusColors['Draft']}>
                                {expense.status}
                            </Badge>
                        </CardTitle>
                        <CardDescription>Review your expense submission</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        ✕
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Expense Date
                        </p>
                        <p className="font-medium">{expense.date}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Paid By
                        </p>
                        <p className="font-medium">{expense.paidBy}</p>
                    </div>
                </div>

                <Separator />

                {/* Amount & Category */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{expense.category}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Total Amount
                        </p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {expense.amount}
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Description
                    </p>
                    <p className="text-sm bg-muted p-3 rounded-md">{expense.description}</p>
                </div>

                {/* Remarks */}
                {expense.remarks && (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Remarks</p>
                        <p className="text-sm bg-muted p-3 rounded-md">{expense.remarks}</p>
                    </div>
                )}

                <Separator />

                {/* Approval History */}
                {expense.status !== 'Draft' && (
                    <div className="space-y-3">
                        <p className="text-sm font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Approval History
                        </p>
                        {approvalHistory.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                <div>
                                    <p className="font-medium">Approver: {item.approver}</p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900">
                                    {item.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}

                {/* Currency Note */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                        <span className="font-semibold">Note:</span> Employee can submit expense in any currency
                        (currency in which they spent the money in receipt). In manager's approval dashboard,
                        the amount should get auto-converted to base currency of the company with real-time
                        today's currency conversion rates.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};