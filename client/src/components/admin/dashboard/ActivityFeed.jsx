import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ActivityFeed = ({ activities }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates in your organization</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    <span className="font-semibold">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                            </div>
                            <div className="text-sm font-semibold">{activity.amount}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
