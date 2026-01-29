
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, DollarSign } from "lucide-react";

export function PublisherDashboard() {
  // Mock stats for now
  const stats = [
    { title: "Total Editions", value: "12", icon: BookOpen, change: "+2 this month" },
    { title: "Active Subscribers", value: "1,234", icon: Users, change: "+15% vs last month" },
    { title: "Monthly Views", value: "45.2k", icon: TrendingUp, change: "+5% vs last month" },
    { title: "Revenue", value: "$12,450", icon: DollarSign, change: "+12% vs last month" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Publisher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening in your city.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Editions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No data available.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
