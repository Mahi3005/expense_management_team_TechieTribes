import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';

export const ApprovalLevelsTable = ({ rules, onToggleRequired }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Approval Levels</CardTitle>
                <CardDescription>Define the approval hierarchy and required approvers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Level</TableHead>
                                <TableHead>Approver</TableHead>
                                <TableHead>Required</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules.map((rule) => (
                                <TableRow key={rule.id}>
                                    <TableCell className="font-medium">Level {rule.level}</TableCell>
                                    <TableCell>{rule.approver}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={rule.required}
                                            onCheckedChange={() => onToggleRequired(rule.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {rule.description}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium mb-1">How Approval Rules Work:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                            <li>Required approvers must approve all requests</li>
                            <li>Optional approvers contribute to minimum percentage</li>
                            <li>With sequence enabled, Level 1 must approve before Level 2, and so on</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
