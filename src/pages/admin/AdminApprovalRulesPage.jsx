import { useState } from 'react';
import { mockApprovalRules, mockApprovalConfiguration } from '@/constants/mockData';
import { ApprovalSettings } from '@/components/admin/approvals/ApprovalSettings';
import { ApprovalLevelsTable } from '@/components/admin/approvals/ApprovalLevelsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Save, Info } from 'lucide-react';
import { toast } from 'sonner';

export const AdminApprovalRulesPage = () => {
    const [rules, setRules] = useState(mockApprovalRules);
    const [config, setConfig] = useState(mockApprovalConfiguration);

    const handleSaveRules = () => {
        toast.success('Approval rules saved successfully!', {
            description: 'Your changes have been applied to the system.',
        });
    };

    const toggleApproverRequired = (ruleId) => {
        setRules(
            rules.map((rule) =>
                rule.id === ruleId ? { ...rule, required: !rule.required } : rule
            )
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold">Approval Rules Configuration</h3>
                <p className="text-sm text-muted-foreground">
                    Configure approval workflow, multi-level approvers, and conditional rules
                </p>
            </div>

            {/* IS MANAGER APPROVER Checkbox */}
            <Card>
                <CardHeader>
                    <CardTitle>Manager Approval Flow</CardTitle>
                    <CardDescription>Configure if expenses require manager approval first</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isManagerApprover"
                            checked={config.isManagerApprover}
                            onCheckedChange={(checked) =>
                                setConfig({ ...config, isManagerApprover: checked })
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="isManagerApprover"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                IS MANAGER APPROVER
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                When checked, expenses are first approved by the employee's manager before moving to next levels
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ApprovalSettings
                approvalSequence={config.approvalSequence}
                setApprovalSequence={(checked) => setConfig({ ...config, approvalSequence: checked })}
                minApprovalPercentage={config.minApprovalPercentage}
                setMinApprovalPercentage={(value) => setConfig({ ...config, minApprovalPercentage: value })}
            />

            {/* Conditional Approval Rules */}
            <Card>
                <CardHeader>
                    <CardTitle>Conditional Approval Flow</CardTitle>
                    <CardDescription>Advanced approval rules for automatic processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="percentageRule"
                            checked={config.conditionalRules.percentageRule}
                            onCheckedChange={(checked) =>
                                setConfig({
                                    ...config,
                                    conditionalRules: { ...config.conditionalRules, percentageRule: checked }
                                })
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="percentageRule" className="text-sm font-medium">
                                Percentage Rule
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                If {config.minApprovalPercentage}% of approvers approve → Expense auto-approved
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="specificApproverRule"
                            checked={config.conditionalRules.specificApproverRule}
                            onCheckedChange={(checked) =>
                                setConfig({
                                    ...config,
                                    conditionalRules: { ...config.conditionalRules, specificApproverRule: checked }
                                })
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="specificApproverRule" className="text-sm font-medium">
                                Specific Approver Rule
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                If CFO or Director approves → Expense auto-approved (bypass other levels)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="hybridRule"
                            checked={config.conditionalRules.hybridRule}
                            onCheckedChange={(checked) =>
                                setConfig({
                                    ...config,
                                    conditionalRules: { ...config.conditionalRules, hybridRule: checked }
                                })
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="hybridRule" className="text-sm font-medium">
                                Hybrid Rule (Combine Both)
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Either {config.minApprovalPercentage}% approval OR CFO approval → Auto-approved
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-900 dark:text-amber-100">
                            <p className="font-medium mb-1">Conditional Rules Priority:</p>
                            <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200">
                                <li>Specific Approver Rule has highest priority</li>
                                <li>Percentage Rule applies when specific approver hasn't approved</li>
                                <li>Hybrid Rule combines both conditions (OR logic)</li>
                                <li>Rules can work together with Multi-level approvers</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ApprovalLevelsTable rules={rules} onToggleRequired={toggleApproverRequired} />

            <div className="flex justify-end">
                <Button onClick={handleSaveRules}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
};
