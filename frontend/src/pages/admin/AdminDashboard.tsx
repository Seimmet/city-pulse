import { 
  Globe, Users, Building2, BookOpen, TrendingUp, ArrowUpRight, 
  ArrowDownRight, DollarSign, Eye, FileText, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stats, cities, publishers, recentActivity } from "@/data/mockData";

const statCards = [
  { 
    title: "Total Cities", 
    value: stats.totalCities, 
    change: "+3", 
    trend: "up", 
    icon: Globe,
    color: "text-info"
  },
  { 
    title: "Active Publishers", 
    value: stats.totalPublishers, 
    change: "+12", 
    trend: "up", 
    icon: Building2,
    color: "text-success"
  },
  { 
    title: "Total Subscribers", 
    value: "285K", 
    change: "+8.2%", 
    trend: "up", 
    icon: Users,
    color: "text-accent"
  },
  { 
    title: "Monthly Revenue", 
    value: "$2.34M", 
    change: "+15.3%", 
    trend: "up", 
    icon: DollarSign,
    color: "text-gold"
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening across the platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1 text-sm">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-success" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === "edition" ? "bg-info/10 text-info" :
                    activity.type === "publisher" ? "bg-success/10 text-success" :
                    activity.type === "milestone" ? "bg-gold/10 text-gold" :
                    "bg-accent/10 text-accent"
                  }`}>
                    {activity.type === "edition" && <BookOpen className="w-5 h-5" />}
                    {activity.type === "publisher" && <Building2 className="w-5 h-5" />}
                    {activity.type === "milestone" && <TrendingUp className="w-5 h-5" />}
                    {activity.type === "city" && <Globe className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.details}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">3 license renewals pending</p>
                  <p className="text-xs text-muted-foreground">Due in next 7 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-info/5 border border-info/20">
                <Building2 className="w-5 h-5 text-info shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">5 publisher applications</p>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">12 content reports</p>
                  <p className="text-xs text-muted-foreground">Need moderation</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Publishers Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Publishers</CardTitle>
            <CardDescription>Highest performing publishers this month</CardDescription>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Publisher</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">City</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subscribers</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {publishers.map((publisher) => (
                  <tr key={publisher.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{publisher.name}</p>
                          <p className="text-sm text-muted-foreground">{publisher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-normal">
                        {publisher.city}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {publisher.subscriptions.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-gold">
                      ${publisher.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={publisher.license === "active" ? "default" : "secondary"}
                        className={publisher.license === "active" ? "bg-success/10 text-success border-success/20" : ""}
                      >
                        {publisher.license}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
