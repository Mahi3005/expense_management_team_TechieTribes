import { useState, useEffect } from 'react';
import { approvalAPI } from '@/api';
import { ApprovalSettings } from '@/components/admin/approvals/ApprovalSettings';
import { ApprovalLevelsTable } from '@/components/admin/approvals/ApprovalLevelsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Save, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminApprovalRulesPage = () => {
    const [rules, setRules] = useState([]);
    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchApprovalConfig();
    }, []);

    const fetchApprovalConfig = async () => {
        try {
            setIsLoading(true);
            const response = await approvalAPI.getApprovalConfig();
            if (response.success && response.data) {
                setConfig(response.data);
                setRules(response.data.levels || []);
            } else {
                // Set default config if no config exists
                setConfig({
                    isManagerApprover: true,
                    approvalSequence: true,
                    minApprovalPercentage: 50,
                    conditionalRules: {
                        percentageRule: false,
                        specificApproverRule: false,
                        hybridRule: false
                    }
                });
                setRules([]);
            }
        } catch (error) {
            console.error('Error fetching approval config:', error);
            toast.error('Failed to load approval configuration', {
                description: error.message
            });
            // Set default config on error
            setConfig({
                isManagerApprover: true,
                approvalSequence: true,
                minApprovalPercentage: 50,
                conditionalRules: {
                    percentageRule: false,
                    specificApproverRule: false,
                    hybridRule: false
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRules = async () => {
        try {
            setIsSaving(true);
            
            // Only send required fields, not MongoDB metadata
            const configData = {
                isManagerApprover: config.isManagerApprover,
                approvalSequence: config.approvalSequence,
                minApprovalPercentage: config.minApprovalPercentage,
                conditionalRules: config.conditionalRules,
                approvalRules: rules
            };
            
            console.log('Saving approval config:', configData);
            
            const response = await approvalAPI.updateApprovalConfig(configData);
            if (response.success) {
                toast.success('Approval rules saved successfully!', {
                    description: 'Your changes have been applied to the system.',
                });
                // Refresh config
                await fetchApprovalConfig();
            }
        } catch (error) {
            console.error('Error saving approval rules:', error);
            toast.error('Failed to save approval rules', {
                description: error.response?.data?.message || error.message
            });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleApproverRequired = (ruleId) => {
        setRules(
            rules.map((rule) =>
                rule.id === ruleId ? { ...rule, required: !rule.required } : rule
            )
        );
    };

    if (isLoading || !config) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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
                <Button onClick={handleSaveRules} disabled={isSaving}>
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};
