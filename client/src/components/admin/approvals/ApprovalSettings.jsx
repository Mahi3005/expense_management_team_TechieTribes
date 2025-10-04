import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export const ApprovalSettings = ({
    approvalSequence,
    setApprovalSequence,
    minApprovalPercentage,
    setMinApprovalPercentage
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Approval Settings</CardTitle>
                <CardDescription>Configure how approval requests are processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="sequence"
                        checked={approvalSequence}
                        onCheckedChange={setApprovalSequence}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor="sequence"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Approval Sequence
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Approvals must be obtained in sequential order
                        </p>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="percentage">Minimum Approval Percentage</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="percentage"
                            type="number"
                            min="0"
                            max="100"
                            value={minApprovalPercentage}
                            onChange={(e) => setMinApprovalPercentage(parseInt(e.target.value) || 0)}
                            className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        At least this percentage of approvers must approve the request
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
