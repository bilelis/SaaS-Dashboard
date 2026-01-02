import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { BarChart3, Users, TrendingUp, Activity } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Your account metrics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Users"
          value="1,234"
          description="Across all plans"
          trend={{ value: 23, isPositive: true }}
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          label="Active Sessions"
          value="456"
          description="Right now"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Revenue"
          value="$12,340"
          description="This month"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6" />}
          label="Conversion"
          value="3.2%"
          description="From free to paid"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Chart rendering would go here</p>
              <p className="text-sm">Using Recharts or similar library</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Chart rendering would go here</p>
              <p className="text-sm">Using Recharts or similar library</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "User signup", user: "john@example.com", time: "2 minutes ago" },
              { action: "Plan upgrade", user: "jane@example.com", time: "1 hour ago" },
              { action: "Payment received", user: "bob@example.com", time: "3 hours ago" },
              { action: "Subscription cancelled", user: "alice@example.com", time: "1 day ago" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
              >
                <div>
                  <p className="font-medium text-foreground">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.user}</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
