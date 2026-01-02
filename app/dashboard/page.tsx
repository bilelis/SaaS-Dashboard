import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/stat-card"
import { Suspense } from "react"
import { CreditCard, BarChart3, TrendingUp, Users } from "lucide-react"

async function DashboardContent() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  const [profileResult, subscriptionsResult, productsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id),
    supabase.from("products").select("*"),
  ])

  const profile = profileResult.data
  const subscriptions = subscriptionsResult.data || []
  const products = productsResult.data || []
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Welcome back, {profile?.full_name || "User"}</h1>
        <p className="text-muted-foreground">Here's your account overview and quick stats</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CreditCard className="w-6 h-6" />}
          label="Active Plans"
          value={activeSubscriptions}
          description="Current subscriptions"
          trend={{ value: 100, isPositive: true }}
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6" />}
          label="Account Status"
          value="Active"
          description="Fully verified"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Usage"
          value="45%"
          description="Of quota used"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard icon={<Users className="w-6 h-6" />} label="Team Members" value="3" description="Active members" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriptions */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Subscriptions</span>
                <Link href="/pricing">
                  <Button variant="outline" size="sm">
                    View Plans
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active subscriptions yet</p>
                  <Link href="/pricing">
                    <Button>Choose a Plan</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub) => {
                    const product = products.find((p) => p.id === sub.product_id)
                    return (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{product?.name || "Plan"}</p>
                          <p className="text-xs text-muted-foreground">
                            Started {new Date(sub.start_date || "").toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          Active
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/users" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  Manage Team
                </Button>
              </Link>
              <Link href="/settings" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  Account Settings
                </Button>
              </Link>
              <Link href="/pricing" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  Upgrade Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
