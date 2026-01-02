"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"

interface Subscription {
  id: string
  product_id: string
  status: string
  start_date: string
  end_date?: string
}

export default function SubscriptionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      const fetchSubscriptions = async () => {
        try {
          const token = localStorage.getItem("auth_token")
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/subscriptions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            setSubscriptions(data)
          }
        } catch (error) {
          console.error("Failed to fetch subscriptions:", error)
        } finally {
          setLoadingData(false)
        }
      }

      fetchSubscriptions()
    }
  }, [user, loading, router])

  const handleCancel = async (subscriptionId: string) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) {
      return
    }

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/subscriptions/${subscriptionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "canceled" }),
        },
      )

      if (response.ok) {
        alert("Subscription canceled successfully")
        setSubscriptions(subscriptions.filter((s) => s.id !== subscriptionId))
      }
    } catch (error) {
      console.error("Failed to cancel subscription:", error)
      alert("Failed to cancel subscription")
    }
  }

  if (loading || loadingData) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground mt-2">Manage your active subscriptions and plans</p>
        </div>

        {subscriptions.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No active subscriptions</h3>
            <p className="text-muted-foreground mb-6">Choose a plan to get started</p>
            <Button onClick={() => router.push("/pricing")}>View Plans</Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="bg-card border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {subscription.status === "active" ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Subscription ID: {subscription.id}</h3>
                      <p className="text-muted-foreground text-sm">
                        Status: <span className="capitalize">{subscription.status}</span>
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Started: {new Date(subscription.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {subscription.status === "active" && (
                    <Button variant="destructive" size="sm" onClick={() => handleCancel(subscription.id)}>
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
