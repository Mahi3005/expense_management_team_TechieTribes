import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StatsCard = ({ title, value, change, icon: Icon, color, bgColor }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={`${bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{change}</p>
            </CardContent>
        </Card>
    );
};
